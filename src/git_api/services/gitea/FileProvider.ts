

import { RepositoryApi} from "@/generated/gitea";
import type {FileProviderI} from "@/git_api/api/FileProvider";
import type {FileI} from "@/git_api/api/File";
import type ContentProviderI from "@/git_api/api/ContentProvider";
import type {FolderI} from "@/git_api/api/Folder";
import Folder from "@/git_api/services/common/Folder";
import GitteaFile from "@/git_api/services/gitea/File";

export default class FileProvider implements FileProviderI{
    readonly owner:string;
    readonly name:string;
    readonly contentProvider:ContentProviderI;
    readonly options?:any;


    constructor( owner:string,name:string,contentProvider:ContentProviderI,options:any=undefined) {
        this.owner = owner;
        this.name = name;
        this.contentProvider = contentProvider;
        this.options = options;
    }

    async getFiles(path:string,commit: string):  Promise<Array<FileI|FolderI>> {
        let file_ret:Array<FileI|FolderI>=[];
        try{
            let files_raw = (await new RepositoryApi().repoGetContents(this.owner,this.name,path, commit)).data;
            (files_raw as Array<any>).map(fileOrFolder=>{
                if(fileOrFolder.type == 'dir'){
                    file_ret.push(new Folder(fileOrFolder.path,commit,this));
                }else if(fileOrFolder.type == 'file'){
                    file_ret.push(new GitteaFile(fileOrFolder.name,fileOrFolder.path,commit,this.contentProvider));
                }
            })
            return file_ret;

        }catch (e){
            console.log(e);
        }
        return [];
    }


}
