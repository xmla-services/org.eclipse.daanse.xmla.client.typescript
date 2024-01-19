

export default interface RepoProviderI{
    readonly options?:any;
    getRepo(name:string): RepoI
}