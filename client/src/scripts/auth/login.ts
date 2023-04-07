import axios, { AxiosResponse } from "axios";
import { IDetailsToLogin } from "../../types/user";
import { LOGIN_COOKIE_TOKEN } from "../config";
import handlePromise from "../promiseHandler";
import { setAuthTokenHeader } from "./headers";


// Updates the auth items using the jwt
export const updateAuthItemsWithJWTToken = (jwt: string, setCookie?: boolean): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const [err, res] = await handlePromise<string>(verifyJWTToken(jwt));

        if (err) {
            deleteJWTCookie();
            setAuthTokenHeader();
            return reject(err);
        }

        const verifiedJWT = res as string;

        if (setCookie) {
            localStorage.setItem(LOGIN_COOKIE_TOKEN, verifiedJWT);
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
        url: "/api/auth/verifylogin",
        data: {
            jwt: jwt,
        },
    })
}

export const deleteJWTCookie = () => {
    if (localStorage[LOGIN_COOKIE_TOKEN]) {
        localStorage.removeItem(LOGIN_COOKIE_TOKEN);
    }
}

export const isLoginDataValid = (loginData: IDetailsToLogin): [boolean, string] => {
    for (const [_, entry] of Object.entries(loginData)) {
        if (entry.length === 0) return [false, "Please fill in all required fields"];
    }

    return [true, ""];
}
