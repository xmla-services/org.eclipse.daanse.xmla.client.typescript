import {CommitI} from "./Commit";
import {FileProviderI} from "@/git_api/api/FileProvider";
import {FileI} from "@/git_api/api/File";
import {BranchI} from "@/git_api/api/Branch";
import {FolderI} from "@/git_api/api/Folder";

export default interface CommitProviderI{
    readonly fileProvider:FileProviderI;
    readonly owner:string;
    readonly name:string;
    readonly options?:any;
    getAllCommits(branch:string):Promise<CommitI[]>
    commitFiles(files:Array<FileI|FolderI>,branch:BranchI):Promise<void>
}