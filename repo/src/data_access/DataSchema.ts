import mongoose, { Schema, Document, Mongoose, mongo } from "mongoose";

function deleteId(doc:Document, ret:Record<string,any>) {
    delete ret._id;
    return ret;
}

/** User */
enum UserRole {
    Admin = "admin",
    User = "user",
    Guest = "guest"
}

interface IUser extends Document {
    name: string;
    passwordHash: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
UserSchema.set('toJSON', { transform: deleteId });

const User = mongoose.model<IUser>('User', UserSchema);

/** provider */
enum ArchitectureType {
    X64      = "x64",
    AMD64    = "amd64",
    I386     = "i386",
    ARM      = "arm",
    ARM64    = "arm64",
    PPC64LE  = "ppc64le",
    PPC64    = "ppc64",
    MIPS64LE = "mips64le",
    MIPS64   = "mips64",
    S390X    = "s390x"
}

interface IProvider extends Document {
    name: string;
    hosted: boolean;
    original_url: string;
    download_url: string;
    created_at: Date;
    updated_at: Date;
    checksum: string;
    checksum_type: string;
    architecture?: ArchitectureType; // for v2 api
    default_architecture?: boolean;  // for v2 api
}

const ProviderSchema: Schema = new Schema({
    name: { type: String, required: true },
    hosted: { type: Boolean, required: true },
    original_url: { type: String, required: true },
    download_url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    checksum: { type: String, required: false },
    checksum_type: { type: String, required: false },
    architecture: { type: String, enum: Object.values(ArchitectureType), required: false },
    default_architecture: { type: Boolean, required: false },
});
ProviderSchema.set('toJSON', { transform: deleteId });

//const Provider = mongoose.model<IProvider>('Provider', ProviderSchema);

/** version */
enum Status {
    Active = "active",
    Unreleased = "unreleased"
}

interface IVersion {
    version: string;
    number: string;
    status: Status;
    description_html: string;
    description_markdown: string;
    release_url: string;
    revoke_url: string;
    providers: IProvider[];
    created_at: Date;
    updated_at: Date;
}

const VersionSchema: Schema = new Schema({
    version: { type: String, required: true },
    number: { type: String, required: true },
    status: { type: String, enum: Object.values(Status), required: true },
    description_html: { type: String, required: false },
    description_markdown: { type: String, required: false },
    release_url: { type: String, required: true },
    revoke_url: { type: String, required: true },
    providers: [ProviderSchema],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
VersionSchema.set('toJSON', { transform: deleteId });

//const Version = mongoose.model<IVersion>('Version', VersionSchema);

/** Box */
interface IBox {
    name: string;
    username: string;
    tag: string;
    private: boolean;
    downloads: number;
    short_description: string;
    description_html: string;
    description_markdown: string;
    current_version: IVersion|null;
    versions: IVersion[];
    created_at: Date;
    updated_at: Date;
}

const BoxSchema: Schema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    tag: { type: String, required: true },
    private: { type: Boolean, required: true },
    downloads: { type: Number, required: true },
    short_description: { type: String, required: false },
    description_html: { type: String, required: false },
    description_markdown: { type: String, required: false },
    current_version: { type: VersionSchema, required: false },
    versions: { type: [VersionSchema], required: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
BoxSchema.set('toJSON', { transform: deleteId });

//const Box = mongoose.model<IBox>('Box', BoxSchema);

/** Organization */
interface IOrganization {
    username: string; // organization name
    avatar_url?: string;
    profile_html?: string;
    profile_markdown?: string;
    boxes: IBox[];
}

const OrganizationSchema: Schema = new Schema({
    username: { type: String, required: true },
    avatar_url: { type: String, required: false },
    profile_html: { type: String, required: false },
    profile_markdown: { type: String, required: false },
    boxes: { type: [BoxSchema], required: false },
});
OrganizationSchema.set('toJSON', { transform: deleteId });

const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);

/** export */
//export {User, Provider, Version, Box, Organization, UserRole, Status, IUser, IProvider, IVersion, IBox, IOrganization};
export {User, Organization, UserRole, Status, IUser, IProvider, IVersion, IBox, IOrganization};
//export {User, Provider, Version, Box, Organization, UserRole, Status};
