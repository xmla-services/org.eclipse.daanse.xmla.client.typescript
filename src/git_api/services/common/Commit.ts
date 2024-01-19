import type {CommitI} from "@/git_api/api/Commit";
import type {FileI} from "@/git_api/api/File";
import type {FileProviderI} from "@/git_api/api/FileProvider";
import type {FolderI} from "@/git_api/api/Folder";


export default class Commit implements CommitI{

     creation_date: string;
     files: Array<FileI|FolderI> = [];
     hash: string;
     message: string;
     name: string;
     fileProvider:FileProviderI

    constructor(name:string, message:string, creation_date:string ,hash:string, fileProvider:FileProviderI) {
        this.name = name;
        this.fileProvider = fileProvider;
        this.message = message;
        this.hash = hash;
        this.creation_date =creation_date;
    }
    async fetchFiles(): Promise<Array<FileI|FolderI>> {
         this.files = await this.fileProvider.getFiles('',this.hash);
         return this.files;
    }
    getFiles():Array<FileI|FolderI> {
         return this.files;
    }

}