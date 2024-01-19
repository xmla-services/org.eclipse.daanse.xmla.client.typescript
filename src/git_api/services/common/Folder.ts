import type {FolderI} from "@/git_api/api/Folder";
import type {FileProviderI} from "@/git_api/api/FileProvider";
import type {FileI} from "@/git_api/api/File";

export default class Folder implements FolderI{
    fileProvider: FileProviderI;
    path: string;
    files: Array<FileI|FolderI>=[];
    commit:string|null;
    constructor(path:string,commit:string|null,fileProvider:FileProviderI) {
        this.fileProvider = fileProvider;
        this.path = path;
        this.commit = commit;
    }
    async fetchFiles() {
        if(!this.commit) throw Error('This Folder istn synced, commit first')
        this.files = await this.fileProvider.getFiles(this.path,this.commit);
        return this.files;
    }
    getFiles(){
        return this.files;
    }
    addFiles(listofFiles: Array<FileI|FolderI>){
        this.files = this.files.concat(listofFiles)
    }

}