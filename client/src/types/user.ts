export interface IUserDetails {
    username: string,
    uid: number,
} 

export interface LoginDetails extends IUserDetails {
    isLoggedIn: Boolean,
} 
