import { AxiosResponse } from "axios";
import { updateCache } from "../../reducers/cache";
import store from "../../store";
import { getUserByUID } from "../api/users";
import { createNotification } from "../layout/notificationManager";
import handlePromise from "../promiseHandler";

export const updateCacheFromUser = async (uid: number) => {
    const [err, result] = await handlePromise<AxiosResponse<any, any>>(getUserByUID(uid));
    if (err || !result || !result.data.success || !result.data.response) {
        createNotification({
            text: "Failed to update local user cache",
        });
        return;
    }
    const data = result.data;
    console.log(data.response);

    store.dispatch(updateCache({ pfp: data.response.pfpdestination }));
}
