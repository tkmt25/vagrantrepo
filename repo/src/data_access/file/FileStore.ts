import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import config from '../../config';
import { User, Box, Organization } from '../DataTypes';
import {UserStore, DataStore} from '../Store';
import {orgDir, orgBaseDir, metadataFilePath} from '../../util/boxfile'

const parseMetadata = async (filepath:string):Promise<Organization> => {
    const content = await fsp.readFile(filepath, 'utf8');
    return JSON.parse(content) as Organization;
}

const getOrgnizations = async ():Promise<Organization[]> => {
    const items = await fsp.readdir(orgBaseDir(), {withFileTypes: true});
    return Promise.all(items
        .filter(item => item.isDirectory() && fs.existsSync(path.resolve(item.path, item.name, 'metadata.json')))
        .map(item => parseMetadata(path.resolve(item.path, item.name, 'metadata.json')))
    );
}

function sortByPropertyName<T>(elem:keyof T, order:"asc"|"desc" = "desc") {
    return (a:T, b:T) => {
        let valueA = a[elem];
        let valueB = b[elem];
        if (typeof valueA ===  'number' && typeof valueB === 'number') {
            return order === "asc" ? valueA - valueB : valueB - valueA;
        } 
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === "asc" ? valueA.localeCompare(valueB)  : valueB.localeCompare(valueA);
        }
        return 0;
    };
}


class FileDataStore implements DataStore {

    /**
     * store an organization
     * @param org organization
     * @returns 
     */
    async store(org: Organization): Promise<void> {
        const dir = orgDir(org.username);

        if (fs.existsSync(dir)) {
            throw Error(`already created ${org.username}`);
        }
        await fsp.mkdir(dir, {recursive: true});

        const filepath = metadataFilePath(org.username);
        return fsp.writeFile(filepath, JSON.stringify(org, null, 2), 'utf8');
    }

    /**
     * 
     * @param org 
     * @returns 
     */
    async update(org: Organization): Promise<void> {
        const filepath = metadataFilePath(org.username);
        return fsp.writeFile(filepath, JSON.stringify(org, null, 2), 'utf8');
    }

    /**
     * 
     * @param orgname 
     * @returns 
     */
    retrieve(orgname: string): Promise<Organization> {
        const filepath = metadataFilePath(orgname);
        return fsp.readFile(filepath, 'utf8').then(value => {
            return JSON.parse(value) as Organization;
        });
    }

    /**
     * 
     * @param query 
     * @param provider 
     * @param sort 
     * @param order 
     * @param limit 
     * @param page 
     * @returns 
     */
    async search(
        query: string, 
        provider: string, 
        sort: string = "downloads",
        order: string = "desc",
        limit: number = 10, 
        page: number = 1
    ): Promise<Box[]> 
    {
        const organizations = await getOrgnizations();
        console.log(organizations);

        let sortProp = (sort === "created") ? "created_at" : sort;
        sortProp = (sort === "updated") ? "updated_at" : sortProp;

        const startIndex = (page - 1) * limit;

        return organizations
                .flatMap(org => org.boxes!)
                // TODO: providerだけの取得
                .filter(box => {
                    return box.username.includes(query) || box.name.includes(query) || box.short_description?.includes(query);
                })
                .sort(sortByPropertyName(sortProp as keyof Box, order as "asc" | "desc"))
                .slice(startIndex, limit);
    }
}


class FileUserStore implements UserStore {
    filepath: string;
    users: User[] = [];

    constructor() {
        this.filepath = path.resolve(config.data_dir, 'users.json');
        if( fs.existsSync(this.filepath) ) {
            const usersData = fs.readFileSync(this.filepath, 'utf8');
            this.users = JSON.parse(usersData);    
        }
    }

    async store(user: User): Promise<void> {
        if( this.users.find(u => u.name === user.name) ) {
            throw new Error(`already created ${user.name}`);
        }
        
        this.users.push(user);
        return fsp.writeFile(JSON.stringify(this.users, null, 2), 'utf8');
    }
    
    async update(user: User): Promise<void> {
        const targetIndex = this.users.findIndex(u => u.name === user.name);
        if (targetIndex < 0) {
            throw new Error(`not exists ${user.name}`);
        }

        this.users[targetIndex] = user;
        return fsp.writeFile(JSON.stringify(this.users, null, 2), 'utf8');
    }

    retrieve(name: string): User {
        const user = this.users.find(u => u.name === name);
        if (!user) {
            throw new Error(`not exists ${name}`);
        }
        return user;
    }
    
}

export {FileDataStore, FileUserStore};