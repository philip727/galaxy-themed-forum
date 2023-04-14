import axios from "axios"

export const createNewPost = (postInfo: {title: string, content: string}) => {
    return axios.request({
        url: `/api/posts/new`,
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: postInfo,
    })
}

export const deletePost = () => {
    return axios.request({
        url: `/api/posts/delete`,
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
}

export const createCommentOnPost = (content: string) => {
    return axios.request({
        url: `/api/posts/newcomment`,
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

export const deleteCommentByIdOnPost = (commentId: number) => {
    return axios.request({
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/api/posts/deletecomment",
        data: {
            commentId: commentId,
        },
    })
}

export const getPostComments = (id: number) => {
    return axios.request({
        url: `/api/posts/id/${id}/comments`,
        method: "GET",
    })
}
