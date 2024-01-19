import type ContentProviderI from "@/git_api/api/ContentProvider";
import type  {FilehashType} from "@/git_api/api/ContentProvider";
import {Octokit} from "octokit";

export default class ContentProvider implements ContentProviderI{
    readonly owner:string;
    readonly repo:string;
    readonly options?:any;
    constructor(owner:string,repo:string,options:any=undefined) {
        this.owner = owner;
        this.repo = repo;
        this.options = options;
    }

    async getContent(arg:FilehashType): Promise<string> {
       const blob = await new Octokit(this.options).rest.git.getBlob({
            owner:this.owner,
            repo:this.repo,
            file_sha:arg.filehash
        })
        return blob.data.content;
    }

}