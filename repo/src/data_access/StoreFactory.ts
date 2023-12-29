import {UserStore, DataStore} from './Store';
import {FileUserStore, FileDataStore} from './file/FileStore';

function dataStore(): DataStore {
    return new FileDataStore();
}

function userStore(): UserStore {
    return new FileUserStore();
}

export { dataStore, userStore } ;