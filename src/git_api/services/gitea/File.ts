import File from '@/git_api/services/common/File';
import {FileState} from "@/git_api/api/FileState";
import {FileParseError} from "@/git_api/services/common/FileParseError";
export default class GitteaFile extends File{

    async fetchContent() {

        if (!this.hash)new Error('File not synced yet, commit first');
        try{
            this.content = (await this.contentProvider.getContent({filehash:this.hash!,path:this.path}));
            this.file_state = FileState.UNTOUCHED;
            return this.content;
        }catch (e){
            console.log(e)
            throw new FileParseError('File not get parsed')
        }

    }
}