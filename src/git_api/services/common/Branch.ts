import type {BranchI} from "@/git_api/api/Branch";
import type CommitProviderI from "@/git_api/api/CommitProvider";
import type {CommitI} from "@/git_api/api/Commit";
import type {FileI} from "@/git_api/api/File";
import type {FolderI} from "@/git_api/api/Folder";

export default class Branch implements BranchI{
     commitProvider:CommitProviderI;
     commits:CommitI[]=[];
     repo:string;
     owner:string;
     name:string;
     sha:string;
    constructor(owner:string,repo:string,name:string,sha:string,commitProvider:CommitProviderI) {
        this.owner =owner;
        this.name=name;
        this.repo = repo;
        this.sha = sha;
        this.commitProvider = commitProvider;
    }

    getCommits() {
        return this.commits;
    }

    async fetchCommits() {
        this.commits =  await this.commitProvider.getAllCommits(this.name);
        return this.commits;
    }

   async addCommit(files: Array<FileI|FolderI>, msg: string): Promise<void> {
        await this.commitProvider.commitFiles(files,this)
    }





}