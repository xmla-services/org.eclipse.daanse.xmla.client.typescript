/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
                   This program and the accompanying materials are made
                   available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/
import config from "@/git_api/conf/gitea.json";
import type {CommitI} from "@/git_api/api/Commit";
import type {FileI} from "@/git_api/api/File";
import type {FolderI} from "@/git_api/api/Folder";
import ProviderFactory from "@/git_api/services/gitea/ProviderFactory";
import { expect, test } from 'vitest'

    const options = {
        accessToken: config.repos[0].token
    }
    const bp =  ProviderFactory.get(config.repos[0].owner,config.repos[0].name,options)


    test('BranchProvider is there', () => {
        expect(bp).not.toBe(undefined)
    });
    test('list Branches', async () => {
        const branches = await bp.fetchBranches();
        expect(branches.length).toBeGreaterThan(0);
    });

test('having a main Branch', async () => {
    const branches = await bp.fetchBranches();
    const main = branches[0];
    console.log(branches)
    expect(main.name).toBe('main')
});

test('having some commits in main Branch', async () => {
    const branches = await bp.fetchBranches();
    const main = branches[0];
    const commits =await main.fetchCommits();
    console.log(commits)
    expect(commits.length).toBeGreaterThan(0)
});

test('having some Files in last Commit', async () => {
    const branches = await bp.fetchBranches();
    const main = branches[0];
    const commits =await main.fetchCommits();
    const latest_commit:CommitI = commits[0];
    const fs:Array<FileI|FolderI> = await latest_commit.fetchFiles();
    console.log(fs)
    expect(fs.length).toBeGreaterThan(0)
});

test('having a test.json File in main branch containing key "v', async () => {
    const branches = await bp.fetchBranches();
    const main = branches[0];
    const commits =await main.fetchCommits();
    const latest_commit:CommitI = commits[0];
    const fs:Array<FileI|FolderI> = await latest_commit.fetchFiles();
    const testJson:FileI = fs.find(entry=>entry.path=='test.json') as FileI;
    await testJson.fetchContent();
    const jsonObj = testJson.getContent();
    console.log('Filecontent:');
    console.log(jsonObj);
    expect(jsonObj).toHaveProperty('v')
});

test('update the content of a File and commit results', async () => {
    const branches = await bp.fetchBranches();
    const main = branches[0];
    let commits =await main.fetchCommits();
    let latest_commit:CommitI = commits[0];
    const fs:Array<FileI|FolderI> = await latest_commit.fetchFiles();
    const testJson:FileI = fs.find(entry=>entry.path=='test.json') as FileI;
    await testJson.fetchContent();
    const jsonObj = testJson.getContent();
    const versionBefore = jsonObj['v']??0;

    console.log('Filecontent before:');
    console.log(jsonObj);

    testJson.setContent({'v':(versionBefore+1)})
    await main.addCommit([testJson], 'change v');

    commits =await main.fetchCommits();
    latest_commit = commits[0];
    const fs2:Array<FileI|FolderI> = await latest_commit.fetchFiles();
    const testJsonAfter:FileI = fs2.find(entry=>entry.path=='test.json') as FileI;
    await testJsonAfter.fetchContent();
    const jsonObjAfter = testJsonAfter.getContent();
    const versionAfter = jsonObjAfter['v']??0;

    console.log('Filecontent after:');
    console.log(jsonObjAfter);

    expect(versionAfter).toBe(versionBefore+1)
});

       /*


        console.log(branches)
        const main = branches[0];
        const commits =await main.fetchCommits();
        console.log(commits)
        const latest_commit:CommitI = commits[0];
        const fnfs:Array<FileI|FolderI> = await latest_commit.fetchFiles();
        console.log(fnfs)
        const descriptionJson:FileI = (await (fnfs[1] as Folder).fetchFiles())[0] as FileI;
        const imgFile:FileI = (await (fnfs[1] as Folder).fetchFiles())[1] as FileI;
        console.log(imgFile)
       // const file:FileI =  dashboards[0] as FileI;

        const blob = (await imgFile.fetchContent());
        //console.log(blob);

        //console.log(blob)
        var image = document.createElement('img');
        image.src = 'data:image/png;base64,'+blob;
        document.body.appendChild(image);

        await descriptionJson.fetchContent();

        console.log(descriptionJson.getContent())
        descriptionJson.setContent({'bild':'katze'})

        console.log(await main.addCommit([descriptionJson],'juju'))
        //firejsonFile.setContent({'version':3});
        //const picFolder = new Folder('pic',null,fp);
        //const desc = new GitteaFile('description.json','pic/decription.json',null,cp,false);
       // desc.setContent({hallo:"welt"});
       // picFolder.addFiles([desc]);
       // console.log(await main.addCommit([picFolder],'juju'))
    }*/


