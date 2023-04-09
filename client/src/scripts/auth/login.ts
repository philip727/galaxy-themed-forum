import axios, { AxiosResponse } from "axios";
import { IDetailsToLogin } from "../../types/user";
import { LOGIN_TOKEN_NAME } from "../config";
import handlePromise from "../promiseHandler";
import { setAuthTokenHeader } from "./headers";


// Updates the auth items using the jwt
export const updateAuthWithJWTToken = (jwt: string, setToken?: boolean): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const [err, res] = await handlePromise<string>(verifyJWTToken(jwt));

        if (err) {
            deleteJWTCookie();
            setAuthTokenHeader();
            return reject(err);
        }

        const verifiedJWT = res as string;

        if (setToken) {
            localStorage.setItem(LOGIN_TOKEN_NAME, verifiedJWT);
        }

        setAuthTokenHeader(verifiedJWT);

        return resolve(verifiedJWT)
    })
}

// Verifies the JWT Token with the server side
export const verifyJWTToken = (jwt: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const [err, res] = await handlePromise<AxiosResponse<any, any>>(requestVerifyLogin(jwt));
        if (err) {
            return reject("Server Error (CVJC)");
        }

        const data = res?.data;

        if (!data.success) {
            return reject(data.response);
        }

        return resolve(data.response);
    })

}

const requestVerifyLogin = (jwt: string) => {
    return axios.request({
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/api/auth/verify/jwt",
        data: {
            jwt: jwt,
        },
    })
}

export const deleteJWTCookie = () => {
    if (localStorage[LOGIN_TOKEN_NAME]) {
        localStorage.removeItem(LOGIN_TOKEN_NAME);
    }
}

export const isLoginDataValid = (loginData: IDetailsToLogin): [boolean, string] => {
    for (const [_, entry] of Object.entries(loginData)) {
        if (entry.length === 0) return [false, "Please fill in all required fields"];
    }

    return [true, ""];
}
