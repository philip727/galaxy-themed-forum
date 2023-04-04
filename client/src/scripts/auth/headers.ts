import axios from 'axios';

export const setAuthTokenHeader = (token?: string) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = token;
        return;
    }

    delete axios.defaults.headers.common["Authorization"];
}
