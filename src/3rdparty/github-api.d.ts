declare namespace fastfork {
    export class Gist {

    }
    export class Github {
        constructor(auth?: any, apiBase?: string);
        getGist(id: number): Gist;
        getUser(user?: string): User;
        getOrganization(organization: string): Organization;
        getTeam(teamId: string): Team;
        getRepo(user: string, repo: string): Repository;
        getIssues(user: string, repo: string): Issue[];
        search(query: string): Search;
        getRateLimit(): RateLimit;
        getMarkdown(): Markdown;
        getProject(id: string): Project;
    }
    export class Issue {

    }
    export class Markdown {

    }
    export class Organization {
        name: string;
        getRepos(cb?: Function): Promise<any>;
    }
    export class Project {

    }
    export class RateLimit {

    }
    export class Repository {
        getDetails(cb?: Function): Promise<any>;
        deleteRepo(cb?: Function): Promise<any>;
        fork(cb?: Function): Promise<any>;
    }
    export class Requestable {

    }
    export class Search {

    }
    export class Team {

    }
    export class User {
        name: string;
        listRepos(options?: any, cb?: Function): Promise<any>;
        getProfile(cb?: Function): Promise<any>;
    }
}