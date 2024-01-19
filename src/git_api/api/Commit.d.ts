import type {FileI} from "./File";
import {FileProviderI} from "@/git_api/api/FileProvider";
import {FolderI} from "@/git_api/api/Folder";

export interface CommitI{
    name:string;
    hash:string;
    message:string;
    files: Array<FileI|FolderI>;
    creation_date:string;
    fileProvider:FileProviderI;
    fetchFiles(): Promise<Array<FileI|FolderI>>;
    getFiles():Array<FileI|FolderI>;
}