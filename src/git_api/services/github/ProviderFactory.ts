import BranchProvider from "@/git_api/services/github/BranchProvider";
import CommitProvider from "@/git_api/services/github/CommitProvider";
import FileProvider from "@/git_api/services/github/FileProvider";
import ContentProvider from "@/git_api/services/github/ContentProvider";

export default class ProviderFactory{
    static get(name:string,owner:string,options?:any){
        return new BranchProvider(name,owner,
            new CommitProvider(name,owner,
                new FileProvider(name,owner,
                    new ContentProvider(name,owner,options),
                    options),
                options),
            options)
    }
}