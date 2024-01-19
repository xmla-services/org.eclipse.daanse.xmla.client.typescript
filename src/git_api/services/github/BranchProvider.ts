/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
                   This program and the accompanying materials are made
                   available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/
import type {BranchProviderI} from "@/git_api/api/BranchProvider";
import {Octokit} from "octokit";
import type CommitProviderI from "@/git_api/api/CommitProvider";
import type {BranchI} from "@/git_api/api/Branch";
import Branch from "@/git_api/services/common/Branch";

export default class BranchProvider implements BranchProviderI{

     branches:BranchI[]=[];
     commitProivder:CommitProviderI;
     owner:string;
     repo:string;
     options?:any;

    constructor(owner,repo,commitProvider:CommitProviderI,options:any=undefined){
        this.owner = owner;
        this.repo = repo;
        this.commitProivder = commitProvider;
        this.options = options;
    }

    async fetchBranches(): Promise<BranchI[]> {
        try {
            this.branches = [];
            let branches = await new Octokit(this.options).rest.repos.listBranches({
                owner:this.owner,
                repo:this.repo,
            })
            branches.data.map(entry=>{
                this.branches.push(new Branch(this.owner,this.repo,entry.name,entry.commit.sha,this.commitProivder))
            });

            return this.branches;

        }catch (e){
            console.log(e);
            return []
        }
    }
    getBranches(){
        return this.branches;
    }

    async addBranch(name:string, sourceBranch:BranchI) {
        try {

        const oc = new Octokit({auth:'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'})
        const sourcefef = await oc.rest.git.getRef({
            owner:this.owner,
            repo: this.repo,
            ref: 'heads/'+sourceBranch.name
        })

        const createResult = await oc.rest.git.createRef({
            owner:this.owner,
            repo:this.repo,
            ref: 'refs/heads/'+name,
            sha: 'd54b43d46f23aa4b93c901d0ff4d44cc0d849e2c'//sourcefef.data.object.sha

        })
            console.log(createResult)
            return ;
            }
            catch (e){
                console.log(e);
                //throw CreateBranchError(e);
            }

    }

}