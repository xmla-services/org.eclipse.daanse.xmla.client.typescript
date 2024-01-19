import type RepoProviderI from "@/git_api/api/RepoProvider";
import type {RepoI} from "@/git_api/api/Repo";
import type {BranchProviderI} from "@/git_api/api/BranchProvider";
import {Repo} from "@/git_api/services/common/Repo";
import {RepositoryApi} from "@/git_api/generated/gitea";



export default class RepoProvider implements RepoProviderI{
    owner:string;
    name:string;
    branchProvider:BranchProviderI;
    options?:any;
    constructor(owner:string,name:string,branchProvider:BranchProviderI,options?:any) {
        this.owner=owner;
        this.name = name;
        this.options = options;
        this.branchProvider = branchProvider;
    }
    async getRepo(): Promise<RepoI> {
        const repo = await new RepositoryApi().repoSearch(this.name,false,false,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,1);
        let id = 'unknown';
        if (repo.data && repo.data.data && repo.data.data[0] && repo.data.data[0].id ){
            id = repo.data.data[0].id.toString();
        }
        return new Repo(this.name,this.owner,id,this.branchProvider);
    }

}