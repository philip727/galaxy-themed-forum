import axios, { AxiosResponse } from "axios";
import jwtDecode from "jwt-decode";
import { IJWTInfo } from "../../types/auth";
import { ModalFunctionTypes } from "../../types/layout";
import { IDetailsToLogin } from "../../types/user";
import { LOGIN_TOKEN_NAME } from "../config";
import { createModal } from "../layout/modalManager";
import handlePromise from "../promiseHandler";
import { setAuthTokenHeader } from "./headers";
import store from '../../store'
import { updateUser } from "../../reducers/user";
import { getUserByUID } from "../api/users";
import { createNotification } from "../layout/notificationManager";


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
        const [err, res] = await handlePromise<AxiosResponse<any, any>>(requestVerifyJWT(jwt));
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

const requestVerifyJWT = (jwt: string) => {
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

export const jwtLogin = async (jwt: string, update?: boolean) => {
    // Verifies the jwt with the server
    const [err, res] = await handlePromise<string>(updateAuthWithJWTToken(jwt, update));
    if (err) {
        // Creates a prompt if with the error message
        createModal({
            header: "Login",
            subtext: err,
            buttons: [
                {
                    text: "Ok",
                    fn: ModalFunctionTypes.CLOSE,
                }
            ]
        });
        return;
    }

    const userDetails = jwtDecode(res as string) as IJWTInfo;

    // If it's been X time then delete the cookie
    const currentTime = Date.now() / 1000;
    if (userDetails.exp < currentTime) {
        deleteJWTCookie();
        return;
    }

    const [err2, res2] = await handlePromise<AxiosResponse<any, any>>(getUserByUID(userDetails.uid));
    if (err2) {
        createNotification({
            text: err2.data.response,
        })
        return;
    }

    if (!res2) {
        createNotification({
            text: "SERVER ERROR (CJL-JD)",
        })
        return;
    }

    const data = res2.data;

    if (!data || !("success" in data) || !("response" in data)) {
        createNotification({
            text: "SERVER ERROR (CJL-JD-R)",
        })
        return;
    }

    if (!data.success) {
        createNotification({
            text: data.response,
        })
        return;
    }

    store.dispatch(updateUser({ username: userDetails.username, uid: userDetails.uid, role: data.response.role, regdate: data.response.regdate }));
}
