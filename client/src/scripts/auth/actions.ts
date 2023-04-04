import { IAuthenticationState, IJWTInfo } from "../../types/auth"

enum Action {
    SET_CURRENT_USER,
    UPDATE_CURRENT_USER,
}

const authenticationState = {
    isAuthenticated: false,
    user: {} as IJWTInfo,
}

export const authAction = (state = authenticationState, action: Action, data: IJWTInfo): IAuthenticationState => {
    switch (action) {
        case Action.SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !(Object.keys(data).length === 0),
                user: data,
            }
        default:
            return state;
    }
}
