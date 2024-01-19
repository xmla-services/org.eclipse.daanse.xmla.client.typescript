import type {FileI} from "@/git_api/api/File";
import type {FolderI} from "@/git_api/api/Folder";

export interface BranchI{
    repo:string;
    owner:string;
    name:string;
    sha:string;
    fetchCommits()
    getCommits()
    addCommit(files:Array<FileI|FolderI>,msg:string):Promise<void>
}