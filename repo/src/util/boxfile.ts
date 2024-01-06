import fsp from 'fs/promises';
import path from 'path';
import config from '../config';

const orgBaseDir = ():string => path.resolve(config.data_dir, 'org');
const orgDir = (org:string):string => path.resolve(orgBaseDir(), org);
const boxDir = (org:string, box:string):string => path.resolve(orgDir(org), box);
const boxFilePath = (org:string, box:string, version:string, provider:string, architecture:string="noarch"):string => path.resolve(boxDir(org, box), `${version}-${provider}-${architecture}.box`);

async function deleteFiles(pattern: RegExp, directory: string):Promise<void> {
    const files = await fsp.readdir(directory);
    await Promise.all(files.map(async file => {
        if (pattern.test(file)) {
            const filepath = path.join(directory, file);
            await fsp.unlink(filepath);
        }
    }));
}

async function createBoxDir(org:string, box:string):Promise<void> {
    await fsp.mkdir(boxDir(org, box), {recursive: true});
}

async function removeBoxDir(org:string, box:string):Promise<void> {
    await fsp.rm(boxDir(org, box), {recursive: true, force: true});
}

async function deleteBoxFiles(org:string, box:string, version:string=".*?", provider:string=".*?", architecture:string=".*?"):Promise<void> {
    const pattern = new RegExp(`${version}-${provider}-${architecture}\.box`);
    await deleteFiles(pattern, boxDir(org, box));
}

export { deleteFiles, createBoxDir, removeBoxDir, deleteBoxFiles, orgBaseDir, orgDir, boxDir, boxFilePath} ;