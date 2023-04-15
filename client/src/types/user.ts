export interface IUserDetails {
    username: string,
    email: string,
}

export interface IPublicUserDetails {
    name: string,
    uid: number,
    role: string,
}

export interface IDetailsToRegister extends IUserDetails {
    password: string,
    confirmPassword: string,
}

export interface IDetailsToLogin {
    username: string,
    password: string,
}

export interface IUserReducerAction {
    payload: { username: string, uid: number, role: string, regdate: string, bio: string },
    type: string,
}

export interface IPublicUserDisplay extends IPublicUserDetails {
    regdate: string,
    pfpdestination: string | null,
}
