export interface IUserDetails {
    username: string,
    email: string,
} 

export interface IPublicUserDetails {
    username: string,
    uid: number,
}

export interface LoginDetails extends IPublicUserDetails {
    isLoggedIn: Boolean,
} 

export interface RegisterData extends IUserDetails {
    password: string,
    confirmPassword: string,
}

export type LoginData = {
    username: string,
    password: string,
}

