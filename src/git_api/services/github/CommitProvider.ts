import type CommitProviderI from "@/git_api/api/CommitProvider";
import type {CommitI} from "@/git_api/api/Commit";
import {Octokit} from "octokit";
import Commit from "@/git_api/services/common/Commit";
import type {FileProviderI} from "@/git_api/api/FileProvider";
import type {FileI} from "@/git_api/api/File";
import type {BranchI} from "@/git_api/api/Branch";
import OktokitMultipleFiles from "octokit-commit-multiple-files";
import type {FolderI} from "@/git_api/api/Folder";
import {FileState} from "@/git_api/api/FileState";

export default class CommitProvider implements CommitProviderI{


    readonly fileProvider:FileProviderI;
    readonly owner:string;
    readonly name:string;
    private readonly _oc;
    readonly options?:any;

    constructor( owner:string,name:string,fileProvider:FileProviderI,options:any=undefined) {
        this.fileProvider = fileProvider;
        this.owner = owner;
        this.name = name;
        this.options = options;
        const oc = Octokit.plugin(OktokitMultipleFiles);
        this._oc = new oc(this.options);
    }

    async getAllCommits(branch: string): Promise<CommitI[]> {
        let commits_ret:CommitI[] = [];
        const commits = await new Octokit(this.options).rest.repos.listCommits({
            owner:this.owner,
            repo:this.name,
            sha:branch
        })
        commits.data.map(commit=>{
            commits_ret.push(
                new Commit(
                    commit.author?.name ?? 'unknown',
                    commit.commit.message,
                    commit.commit?.author?.date ?? '',
                    commit.sha,
                    this.fileProvider
                ))
        })
        return commits_ret;
    }

    async commitFiles(files:Array<FileI|FolderI>,branch:BranchI){
        //make flat
        let flat:FileI[]=[];

            const recurse = function(files:Array<FileI|FolderI>){
                files.forEach(fileOrFolder=>{
                    if("files" in fileOrFolder && fileOrFolder.files != undefined){
                        //Folder
                        recurse(fileOrFolder.files)
                    }
                    else{
                        flat.push(fileOrFolder as FileI);
                    }
                })
            }
            recurse(files);

        //find delete Files
        const listOfDeletions = flat.filter(file=>
            file.file_state===FileState.DELETED
        );
        console.log('commit')
        try {
            //@ts-ignore
            const commitFilesAwns = await this._oc.createOrUpdateFiles({
                owner: this.owner,
                repo: this.name,
                branch: branch.name,
                createBranch: false,
                changes: [
                    {
                        message: "Update Files",
                        files: flat.reduce<any>((a,file)=>{
                            if(file.file_state===FileState.MODIFIED ||
                                file.file_state == FileState.NEW){
                                a[file.path]=file.content;
                                return a;
                            }

                        },{}),
                        filesToDelete: listOfDeletions.map(f=>f.path),
                        ignoreDeletionFailures: true
                    }]
            });
            return
        }catch (e){
            console.log(e);
            return
        }
    }

}