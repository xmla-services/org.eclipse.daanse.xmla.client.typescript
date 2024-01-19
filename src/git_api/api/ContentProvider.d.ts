import {CommitI} from "./Commit";

export default interface ContentProviderI{
    owner:string;
    repo:string;
    readonly options?:any;
    getContent(arg:FilehashType|FilehashPathType) : Promise<string|null>
}
export interface FilehashType{
    filehash:string
}
export interface FilehashPathType{
    filehash:string,
    path:string
}