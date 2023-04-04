import axios from "axios";
import { API_URL, LOGIN_COOKIE_NAME } from "../config";
import { setAuthTokenHeader } from "./headers";


export const updateAuthItemsWithJWTCookie = (jwt: string, setCookie?: boolean): Promise<[boolean, string]> => {
    return new Promise(async (resolve, reject) => {
        await verifyJWTCookie(jwt)
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
                return reject([false, err])
            })
    })
}

export const verifyJWTCookie = (jwt: string): Promise<[boolean, string]> => {
    return new Promise(async (resolve, reject) => {
        axios.request({
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            url: `${API_URL}/api/auth/verifylogin`,
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
            .catch(_ => reject("Server Error (13)"))
    })

}

export const deleteJWTCookie = () => {
    if (localStorage[LOGIN_COOKIE_NAME]) {
        localStorage.removeItem(LOGIN_COOKIE_NAME);
    }
}
