import axios from "axios"

export const setPfp = (formData: FormData) => {
    return axios.request({
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        url: "/api/account/uploadpfp",
        data: formData,
    })
}

export const clearPfp = () => {
    return axios.request({
        method: 'PUT',
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        url: "/api/account/clearpfp",
    })
}
