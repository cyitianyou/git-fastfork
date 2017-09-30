import { GitFastFork } from "./GitFastFork";
import { IGitFastFork } from "./api/GitFastFork.d";
// export * from "./GitFastFork";
// export * from "./api/GitFastFork.d";
/** 用户口令 */
export const userToken: string = function (): string {
    if ((<any>window).fastfork === undefined) {
        (<any>window).fastfork = {};
    }
    (<any>window).fastfork.userToken = window.localStorage.getItem("githubUserToken");
    return (<any>window).fastfork.userToken;
}();
/** 用户口令 */
export const organizationName: string = function (): string {
    if ((<any>window).fastfork === undefined) {
        (<any>window).fastfork = {};
    }
    (<any>window).fastfork.organizationName = window.localStorage.getItem("githubOrganizationName");
    return (<any>window).fastfork.organizationName;
}();
/** 管理者 */
export const gitFastForkManager: IGitFastFork = function (): IGitFastFork {
    if ((<any>window).fastfork === undefined) {
        (<any>window).fastfork = {};
    }
    if ((<any>window).fastfork.manager === undefined) {
        (<any>window).fastfork.manager = new GitFastFork(userToken, organizationName);
    }
    return (<any>window).fastfork.manager;
}();

