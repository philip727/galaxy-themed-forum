export interface IJWTInfo {
    username: string,
    uid: number,
    iat: number,
    exp: number,
}

export interface IAuthenticationState {
   isAuthenticated: boolean,
   user: IJWTInfo,
}

export interface IJWTLoginInfo {
    success: boolean,
    data: IJWTInfo,
}
