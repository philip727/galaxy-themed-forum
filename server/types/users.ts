export type RegisterData = {
    username: string,
    password: string,
    email: string,
}

export type LoginData = {
    username: string,
    password: string,
}

export interface IDataFromExistingUser {
    username: string,
    uid: string,
    password: string,
}

export interface IQueryData {
    response: object,
}

export interface IUploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
