export interface IJWTInfo {
    username: string,
    uid: string,
    iat: number,
    exp: number,
}

export interface IAuthenticationState {
   isAuthenticated: boolean,
   user: object,
}
