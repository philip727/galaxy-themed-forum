export type RegisterData = {
    username: string,
    password: string,
    email: string,
}

export type LoginData = {
    username: string,
    password: string,
}

export interface IUserExistData {
    username: string,
    uid: string,
    password: string,
}


