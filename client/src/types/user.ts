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

export interface IDetailsToRegister extends IUserDetails {
    password: string,
    confirmPassword: string,
}

export type DetailsToLogin = {
    username: string,
    password: string,
}

