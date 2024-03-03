import crypto from "crypto";
import config from "../config";
import { Organization, User, UserRole } from "../data_access/DataSchema";

async function createUser(name:string, password:string, role:UserRole) {
    const hash = crypto.createHash('sha1');
    hash.update(password);

    return new User({
        name: name,
        passwordHash: hash.digest('hex'),
        role: role,
    }).save();
}

async function setupUser() {
    // delete exists admin user
    await User.deleteOne({role: UserRole.Admin});
    await User.deleteOne({role: UserRole.Guest});

    await createUser(config.admin_username, config.admin_password, UserRole.Admin);
    await createUser("guest", "guest", UserRole.Guest);
    
    // test org
    const existsTestUser = await Organization.exists({username: "test"});
    if (!existsTestUser) {
        //await Organization.deleteOne({username: "test"});
        await new Organization({
            username: "test",
            boxes: []
        }).save();
    }
}

export default setupUser;