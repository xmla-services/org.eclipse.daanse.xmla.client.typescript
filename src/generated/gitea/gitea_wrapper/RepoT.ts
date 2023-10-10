export interface WrapperI{
    getRepos():Promise<RepoI[]>

}
export class CastError extends Error {
    // . declare any additional properties or methods .
}
export class FileParseError extends Error {
    // . declare any additional properties or methods .
}

export interface RepoI {
    name: string;
    owner: string;
    id: number;
    dashboards:DashboardI[]
    getDashboards():Promise<DashboardI[]>
}
export interface DashboardI {
    name:string
    path:string
    url:string
    last_change:number
    content:string
}
