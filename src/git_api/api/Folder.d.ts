import type {FileProviderI} from "@/git_api/api/FileProvider";
import type {FileI} from "@/git_api/api/File";

export interface FolderI{
    path:string,
    fileProvider:FileProviderI;
    commit:string|null;
    files:Array<FileI|FolderI>;
    fetchFiles():Promise<Array<FileI|FolderI>>;
    getFiles():Array<FileI|FolderI>;
    addFiles(listofFiles: Array<FileI|FolderI>);
}