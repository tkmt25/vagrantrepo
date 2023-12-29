import { Organization, Box, User } from "./DataTypes";


interface DataStore {
    store(org:Organization): void
    update(org:Organization): void
    retrieve(orgname:string): Promise<Organization>
    search(query: string, provider:string, sort:string, order:string, limit:number, page:number): Promise<Box[]>
};

interface UserStore {
    store(acount:User): void;
    update(acount:User): void;
    retrieve(name:string): User;
}


class RBACDataStore {
    dataStore: DataStore;
    userStore: UserStore;

    constructor(dataStore:DataStore, userStore:UserStore) {
        this.dataStore = dataStore;
        this.userStore = userStore;
    }

    async store(username:string, org: Organization): Promise<void> {
        // check org in user
        const user = await this.userStore.retrieve(username);
        if( !user.organizationNames.find(n => n === org.username) ) {
            throw Error("404");
        }

        
    }
    update(org: Organization): void {
        throw new Error("Method not implemented.");
    }
    retrieve(orgname: string): Promise<Organization> {
        throw new Error("Method not implemented.");
    }
    search(query: string, provider: string, sort: string, order: string, limit: number, page: number): Promise<Box[]> {
        throw new Error("Method not implemented.");
    }
}

export {DataStore, UserStore};