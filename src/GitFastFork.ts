
import { IGitFastFork, IGitRepository } from "./api/GitFastFork.d";
export class GitFastFork implements IGitFastFork {
    private user: fastfork.User;
    private api: fastfork.Github;
    private organization: fastfork.Organization;
    private gitRepos: IGitRepository[];
    constructor(userToken: string, organizationName?: string) {
        this.api = new fastfork.Github({
            token: userToken
        });
        this.user = this.api.getUser();
        if (!organizationName) {
            organizationName = "color-coding";
        }
        this.organization = this.api.getOrganization(organizationName);
        this.organization.name = organizationName;
        this.gitRepos = [];
        this.isInitialized = false;
    }
    private reposChangedListeners: Array<Function>;
    private initializedListeners: Array<Function>;
    /** 添加初始化完成监听 */
    addInitializedListener(listener: Function): void {
        if (!this.initializedListeners) {
            this.initializedListeners = new Array<Function>();
        }
        this.initializedListeners.push(listener);
    }
    /** 添加初始化完成监听 */
    addReposChangedListener(listener: Function): void {
        if (!this.reposChangedListeners) {
            this.reposChangedListeners = new Array<Function>();
        }
        this.reposChangedListeners.push(listener);
    }
    /** 初始化完成 */
    isInitialized: boolean;
    initialize(): void {
        let that: this = this;
        this.gitRepos = [];
        this.user.getProfile((error: any, user: any) => {
            that.user.name = user.login;
        }).then((value: any) => {
            this.organization.getRepos((error: any, repos: any[]) => {
                if (repos.length > 0) {
                    let index: number = 0;
                    let getDetails: Function = function (): void {
                        let orgRepo: any = repos[index];
                        let repository: fastfork.Repository = that.api.getRepo(that.user.name, orgRepo.name);
                        repository.getDetails((error: any, repo: any) => {
                            let gitRepo: IGitRepository = new GitRepository();
                            gitRepo.name = orgRepo.name;
                            if (error) {
                                gitRepo.fork = false;
                            } else if (repo && repo.source.owner.login === that.organization.name) { // 找到仓库
                                gitRepo.fork = true;
                            } else {
                                gitRepo.fork = false;
                            }
                            that.gitRepos.push(gitRepo);
                            that.fireReposChanged();
                            if (repos.length > index + 1) {
                                index++;
                                getDetails();
                            } else {
                                that.fireInitialized();
                            }
                        });
                    };
                    getDetails();
                }
            });
        });

    }
    /** 初始化完成，需要手工调用 */
    protected fireInitialized(): void {
        this.isInitialized = true;
        if (!this.initializedListeners) {
            return;
        }
        for (let listener of this.initializedListeners) {
            if (listener instanceof Function) {
                listener.call(listener, this);
            }
        }
        // 清除监听
        delete (this.initializedListeners);
    }
    /** 初始化完成，需要手工调用 */
    protected fireReposChanged(): void {
        if (!this.reposChangedListeners) {
            return;
        }
        for (let listener of this.reposChangedListeners) {
            if (listener instanceof Function) {
                listener.call(listener, this);
            }
        }
    }
    getRepos(): IGitRepository[] {
        return this.gitRepos;
    }
    // fork仓库到用户
    forkToUser(repo: IGitRepository): Promise<boolean> {
        let that: this = this;
        if (repo.fork) {
            this.delete(repo).then((value: any) => {
                repo.fork = false;
                return that.fork(repo);
            });
        } else {
            return that.fork(repo);
        }
    }
    // 删除用户fork的仓库
    delete(repo: IGitRepository): Promise<any> {
        console.log("正在删除原项目...");
        let repository: fastfork.Repository = this.api.getRepo(this.user.name, repo.name);
        return repository.deleteRepo((error: any, res: any) => {
            console.log("删除完成");
            repo.fork = false;
        });
    }
    fork(repo: IGitRepository): Promise<boolean> {
        console.log("正在fork");
        let repository: fastfork.Repository = this.api.getRepo(this.organization.name, repo.name);
        return repository.fork((error: any, res: any) => {
            console.log("fork完成");
            repo.fork = true;
        });
    }
}
export class GitRepository implements IGitRepository {
    // 是否选中
    state: boolean;
    // 仓库名称
    name: string;
    // 是否已经fork
    fork: boolean;
    // 消息
    msg: string;
}