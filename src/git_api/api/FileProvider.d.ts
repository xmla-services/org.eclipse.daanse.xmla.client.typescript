import type {FileI} from "./File";
import {BranchI} from "@/git_api/api/Branch";

export interface FileProviderI{
    readonly options?:any;
    getFiles(path:string,commit:string):Promise<Array<FileI|FolderI>>

}