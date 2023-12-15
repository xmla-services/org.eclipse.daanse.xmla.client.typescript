import type {WrapperI} from "./git_api";
import {RepositoryApi} from "@/generated/gitea";
import {Repo} from "./Repo";

export default class GiteaWrapper implements WrapperI{


    async getRepos(): Promise<Repo[]> {
        let git_tea_repos = (await new RepositoryApi().repoSearch()).data;
        console.log(git_tea_repos)
        let ret:Repo[] = [];
        for (let repo of git_tea_repos.data){
            console.log(repo)
            try{
                ret.push(new Repo(repo))
            }catch (e){

            }
        }
        return ret;
    }



}
