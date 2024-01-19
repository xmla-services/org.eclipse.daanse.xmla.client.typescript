import CommitProviderI from "./CommitProvider";
import BranchProviderI from "./BranchProvider";
import type {FileI} from "./File";
import type {FileProviderI} from "./FileProvider";
import {BranchI} from "@/git_api/api/Branch";

export interface RepoI {
    //constructor(fileProvider:FileProviderI):void;
    name: string;
    owner: string;
    id: string;
    branches: BranchI[];
    getBranches()
    fetchBranches()
    addBranch(name:string,sourceBranch:BranchI)

}