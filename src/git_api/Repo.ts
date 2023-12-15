import {CastError} from "./git_api";
import type {DashboardI, RepoI} from "./git_api";
import {RepositoryApi} from "@/generated/gitea";
import Dashboard from "./Dashboard";

export class Repo implements RepoI {
    dashboards: DashboardI[];
    id: number;
    name: string;
    owner: string;

    constructor(raw:any) {
        try{
            this.name = raw.name;
            this.owner = raw.owner.login;
            this.id = raw.id;
            this.dashboards = [];
        }catch(e){
            throw new CastError('Not castable')
        }
    }

    async getDashboards(): Promise<DashboardI[]> {

        let files = (await new RepositoryApi().repoGetContents(this.owner,this.name,'dashboards')).data
        console.log(files)
        //@ts-ignore
        files = files.filter(e=>e.name.includes('.json'))

        for(let file of files){
            try{
                this.dashboards.push(new Dashboard(this,file))
            }catch (e){
                console.log(e)
            }
        }
        (this.dashboards[0] as Dashboard).fetchContent()
        return Promise.resolve([]);
    }

}
