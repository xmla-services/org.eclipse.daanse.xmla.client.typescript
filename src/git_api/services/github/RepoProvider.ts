import type RepoProviderI from "@/git_api/api/RepoProvider";
import type {RepoI} from "@/git_api/api/Repo";
import type {BranchProviderI} from "@/git_api/api/BranchProvider";
import {Octokit} from "octokit";
import {Repo} from "@/git_api/services/common/Repo";


export default class RepoProvider implements RepoProviderI{
    owner:string;
    name:string;
    branchProvider:BranchProviderI;
    options?:any;
    constructor(owner:string,name:string,branchProvider:BranchProviderI,options:any) {
        this.owner=owner;
        this.name = name;
        this.options = options;
        this.branchProvider = branchProvider;
    }
    async getRepo(): Promise<RepoI> {
        const repos = await new Octokit().rest.repos.get({owner:this.owner,repo:this.name});
        return new Repo(repos.data.name,repos.data.owner.name ?? 'unknown',repos.data.id.toString(),this.branchProvider);
    }

}