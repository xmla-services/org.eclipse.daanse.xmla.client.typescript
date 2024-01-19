import type {BranchI} from "@/git_api/api/Branch";
export interface BranchProviderI{
     readonly options?:any;
     fetchBranches(): Promise<BranchI[]>
     getBranches():BranchI[];
     addBranch(name:string, sourceBranch:BranchI):Promise<void>;
}