import path from 'path'

export const ORIGIN_URL = "http://localhost:3000";
export const JWT_KEY = "secretkey";
export const DEFAULT_COLUMNS = ["name", "uid", "role", "regdate", "pfpdestination", "bio"]
export const BCRYPT_SALT_ROUNDS = 12;
export const PROFILE_PICTURE_FOLDER = path.join(__dirname, "public", "profiles");
