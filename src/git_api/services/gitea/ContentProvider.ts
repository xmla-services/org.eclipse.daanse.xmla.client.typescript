import type  {FilehashPathType} from "@/git_api/api/ContentProvider";
import type ContentProviderI from "@/git_api/api/ContentProvider";
import {RepositoryApi} from "@/generated/gitea";


export default class ContentProvider implements ContentProviderI{
    owner:string;
    repo:string;
    readonly options?:any;
    constructor(owner:string,repo:string,options:any=undefined) {
        this.owner = owner;
        this.repo = repo;
        this.options = options;
    }

    async getContent(arg:FilehashPathType): Promise<string|null> {
        try {
            return (await new RepositoryApi().repoGetContents(this.owner, this.repo, arg.path, arg.filehash)).data.content!
        }catch (e){
            console.log(e)
            return null;
        }

    }


}