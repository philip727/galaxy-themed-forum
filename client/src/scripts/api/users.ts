import axios from "axios"
import { IDetailsToRegister } from "../../types/user"

export const getUserByUID = (uid: number) => {
    return axios.request({
        url: `/api/user/id/${uid}`,
        method: "GET",
    })

}
export const getUserComments = (uid: number) => {
    return axios.request({
        url: `/api/user/id/${uid}/comments`,
        method: "GET",
    })
}

export const createUserComment = (content: string) => {
    return axios.request({
        url: `/api/user/newcomment`,
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
            content: content,
        }
    })
}

export const createUser = (details: IDetailsToRegister) => {
    return axios.request({
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/api/user/register",
        data: {
            username: details.username,
            email: details.email,
            password: details.password,
        },
    })
}

export const loginAsUser = (username: string, password: string) => {
    return axios.request({
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/api/user/login",
        data: {
            username: username,
            password: password,
        },
    })
}

export const deleteCommentById = (commentId: number) => {
    return axios.request({
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/api/user/deletecomment",
        data: {
            commentId: commentId,
        },
    })

}
