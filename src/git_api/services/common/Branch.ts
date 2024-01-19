/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
                   This program and the accompanying materials are made
                   available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/
import type {BranchI} from "@/git_api/api/Branch";
import type CommitProviderI from "@/git_api/api/CommitProvider";
import type {CommitI} from "@/git_api/api/Commit";
import type {FileI} from "@/git_api/api/File";
import type {FolderI} from "@/git_api/api/Folder";

export default class Branch implements BranchI{
     commitProvider:CommitProviderI;
     commits:CommitI[]=[];
     repo:string;
     owner:string;
     name:string;
     sha:string;
    constructor(owner:string,repo:string,name:string,sha:string,commitProvider:CommitProviderI) {
        this.owner =owner;
        this.name=name;
        this.repo = repo;
        this.sha = sha;
        this.commitProvider = commitProvider;
    }

    getCommits() {
        return this.commits;
    }

    async fetchCommits() {
        this.commits =  await this.commitProvider.getAllCommits(this.name);
        return this.commits;
    }

   async addCommit(files: Array<FileI|FolderI>, msg: string): Promise<void> {
        await this.commitProvider.commitFiles(files,this)
    }





}