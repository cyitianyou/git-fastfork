/// <reference path="../3rdparty/github-api.d.ts" />
export interface IGitFastFork {
    /** 添加初始化完成监听 */
    addInitializedListener(listener: Function): void;
    addReposChangedListener(listener: Function): void;
    /** 初始化 */
    initialize(): void
    getRepos(): IGitRepository[];
}
export interface IGitRepository {
    // 仓库名称
    name: string;
    // 是否已经fork
    fork: boolean;
}