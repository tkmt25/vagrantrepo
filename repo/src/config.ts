import path from 'path';

const port = process.env.PORT || 3010;
const data_dir = process.env.DATA_DIR || path.resolve(__dirname, "../data");

const config = {
    port: port,
    data_dir: data_dir,
    db_url: process.env.DB_URL,
    base_url: process.env.BASE_URL || `http://localhost:${port}`,
    file_limit: process.env.FILE_LIMIT || '30gb',
    public_key_path: process.env.PUBLIC_KEY_PATH || path.resolve(data_dir, 'public.key'),
    private_key_path: process.env.PRIVATE_KEY_PATH || path.resolve(data_dir, 'private.key'),
    admin_username: process.env.ADMIN_USERNAME || "admin",
    admin_password: process.env.ADMIN_PASSWORD  || "password"
};

export default config;