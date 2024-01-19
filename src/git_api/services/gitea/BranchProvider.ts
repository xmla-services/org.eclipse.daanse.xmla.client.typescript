import type {BranchProviderI} from "@/git_api/api/BranchProvider";
import {RepositoryApi} from "@/generated/gitea";
import type {BranchI} from "@/git_api/api/Branch";
import type CommitProviderI from "@/git_api/api/CommitProvider";
import Branch from "@/git_api/services/common/Branch";


export default class BranchProvider implements BranchProviderI {

    branches:BranchI[]=[];
    commitProivder:CommitProviderI;
    owner:string;
    repo:string;
    readonly options?:any;
    constructor(owner,repo,commitProvider:CommitProviderI,options:any=undefined){
        this.owner = owner;
        this.repo = repo;
        this.commitProivder = commitProvider;
        this.options = options;
    }
    getBranches(): BranchI[] {
        return [];
    }
    async fetchBranches(): Promise<BranchI[]> {
        let branches = (await new RepositoryApi().repoListBranches(this.owner,this.repo)).data;
        if(branches){
            this.branches = [];
            branches.map(br=>{
                this.branches.push(new Branch(this.owner,this.repo,br.name??'unkown',br.commit!.id??'',this.commitProivder))
            })
        }
        return this.branches;
    }
    async addBranch(name:string, sourceBranch:BranchI){
            //Todo add Branch
    }

}