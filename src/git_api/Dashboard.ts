
import {CastError, FileParseError} from "./git_api";
import type {DashboardI} from "./git_api";
import {Repo} from "./Repo";
import {RepositoryApi} from "@/generated/gitea";

export default class Dashboard implements DashboardI{
    content: string = '';
    path: string;
    last_change: number = new Date().getDate();
    name: string;
    parent:Repo;

    constructor(parent:Repo,raw:any) {
        try{
            this.parent = parent;
            this.name = raw.name;
            this.path = raw.path;
            this.url = raw.url;
        }catch(e){
            throw new CastError('Not castable')
        }
    }
    async fetchContent(){
        try{
            const content_base64 = (await new RepositoryApi().repoGetContents(this.parent.owner,this.parent.name,this.path)).data.content;
            const content_as_string = atob(content_base64!);
            const content = JSON.parse(content_as_string);
            this.content = content;
        }catch (e){
            throw new FileParseError('File not get parsed')
        }
    }

    url: string;


}
