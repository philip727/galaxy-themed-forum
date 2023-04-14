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
