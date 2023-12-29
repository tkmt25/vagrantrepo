import { userStore } from "../data_access/StoreFactory"
import config from "../config";
import { User } from "../data_access/DataTypes";

const store = userStore();

const initialUsers:User[] = [
    {
        name: config.admin_username,
        passwordHash: "",
        roles: [],
        organizationNames: []
    },
    {
        name: config.admin_username,
        passwordHash: "",
        roles: [],
        organizationNames: []
    },
]; 