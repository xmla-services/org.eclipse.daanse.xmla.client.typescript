import type {FileState} from "@/git_api/api/FileState";
import type ContentProviderI from "@/git_api/api/ContentProvider";

export interface FileI{
    name:string
    content:any
    path:string;
    contentProvider:ContentProviderI;
    file_state:FileState
    hash:string|null;
    fetchContent():Promise<void>;
    getContent():string|object;
    setContent(content:any):void
    delete():void
}
