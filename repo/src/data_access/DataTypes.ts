enum Status {
    Active = "active",
    Unreleased = "unreleased"
}

interface Provider {
    name: string;
    hosted: boolean;
    original_url: string;
    download_url: string;
    created_at: Date;
    updated_at: Date;
    checksum?: string;
    checksum_type?: string;
}

interface Version {
    version: string;
    number: string;
    status: Status;
    description_html?: string;
    description_markdown?: string;
    release_url: string;
    revoke_url: string;
    providers: Provider[];
    created_at: Date;
    updated_at: Date;
}

interface Box {
    name: string;
    username: string;
    tag: string;
    private: boolean;
    downloads: number;
    short_description?: string;
    description_html?: string;
    description_markdown?: string;
    current_version?: Version;
    versions: Version[];
    created_at: Date;
    updated_at: Date;
}

interface Organization {
    username: string; // organization name
    hash: string;
    avatar_url?: string;
    profile_html?: string;
    profile_markdown?: string;
    boxes: Box[];
}

interface User {
    name: string;
    passwordHash: string;
    roles: string[];
    organizationNames: string[];
}

export {Organization, Provider, Version, Box, Status, User};