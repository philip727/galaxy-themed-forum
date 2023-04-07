import axios from "axios";
import { IDetailsToLogin } from "../../types/user";
import { LOGIN_COOKIE_NAME } from "../config";
import { setAuthTokenHeader } from "./headers";


export const updateAuthItemsWithJWTCookie = (jwt: string, setCookie?: boolean): Promise<[boolean, string]> => {
    return new Promise((resolve, reject) => {
        verifyJWTCookie(jwt)
            .then(data => {
                const [success, response] = data;
                if (!success) {
                    return reject([false, response])
                }

                if (setCookie) {
                    localStorage.setItem(LOGIN_COOKIE_NAME, response);
                }

                setAuthTokenHeader(response);

                return resolve([true, response])
            })
            .catch(err => {
                deleteJWTCookie();
                setAuthTokenHeader();
                return reject([false, err]);
            })
    })
}

export const verifyJWTCookie = (jwt: string): Promise<[boolean, string]> => {
    return new Promise((resolve, reject) => {
        axios.request({
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
            .then(res => {
                if (!res.data.success) {
                    return reject([false, res.data.response])
                }

                return resolve([true, res.data.response])
            })
            .catch(_ => reject("Server Error (CVJC)"))
    })

}

export const deleteJWTCookie = () => {
    if (localStorage[LOGIN_COOKIE_NAME]) {
        localStorage.removeItem(LOGIN_COOKIE_NAME);
    }
}

export const isLoginDataValid = (loginData: IDetailsToLogin): [boolean, string] => {
    for (const [_, entry] of Object.entries(loginData)) {
        if (entry.length === 0) return [false, "Please fill in all required fields"];
    }

    return [true, ""];
}
