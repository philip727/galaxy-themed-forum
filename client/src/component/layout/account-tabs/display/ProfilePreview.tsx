import { AxiosResponse } from "axios";
import { motion } from "framer-motion"
import { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { clearPfp, setPfp } from "../../../../scripts/api/account";
import { createNotification } from "../../../../scripts/layout/notificationManager";
import { determineClass, formatDate, getPfp } from "../../../../scripts/layout/profile"
import handlePromise from "../../../../scripts/promiseHandler";
import { updateCacheFromUser } from "../../../../scripts/utils/cache";
import { RootState } from "../../../../store";

export default function ProfilePreview() {
    const user = useSelector((state: RootState) => state.user.value);
    const cache = useSelector((state: RootState) => state.cache.value)

    return (
        <div className="container w-full flex flex-col items-start pb-8 mt-2">
            <span className="h-[2px] w-full bg-[var(--blue-violet)]" />
            <div className="flex flex-row mt-6 ml-6">
                <div className="relative">
                    <img className="w-28 h-28 rounded-full thin-shadow" src={getPfp(cache.pfp)} />
                    <motion.label
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3, delay: 0 }}
                        className="w-10 h-10 bg-[var(--blue-violet)] thin-shadow absolute -bottom-2 rounded-full cursor-pointer flex flex-row justify-center items-center"
                    >
                        <img className="h-6 w-6" src="images/pencil-white.svg" />
                        <input className="image-upload" onChange={(e) => { handlePictureChange(e, user.uid) }} accept="image/png, image/gif, image/jpeg" type="file" name="avatar" />
                    </motion.label>
                    <motion.div
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3, delay: 0 }}
                        className="w-10 h-10 bg-[var(--full-red)] absolute -bottom-2 thin-shadow right-0 rounded-full cursor-pointer flex flex-row justify-center items-center"
                        onClick={() => onClickClear(user.uid)}
                    >
                        <img className="h-[1.35rem] w-[1.35rem]" src="images/cross-white.svg" />
                    </motion.div>
                </div>
                <div className="flex flex-col ml-4">
                    <p className="font-extrabold text-3xl">{user.username}</p>
                    <p className={`${determineClass(user.role)} text-xl`}>{user.role}</p>
                    <div className="">
                        <p className="font-semibold text-lg">Regsister Date: {formatDate(user.regdate)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const onClickClear = async (uid: number) => {
    const [err, result] = await handlePromise<AxiosResponse<any, any>>(clearPfp());
    if (err) {
        createNotification({
            text: err.data.response,
        });
        return;
    }

    const data = result?.data;

    if (!data || !("success" in data) || !("response" in data)) {
        createNotification({
            text: "SERVER ERROR (C-UPFP)",
        });
        return;
    }

    if (!data.success) {
        createNotification({
            text: data.response,
        });
        return;
    }

    createNotification({
        text: data.response,
    });

    updateCacheFromUser(uid);
}

const handlePictureChange = async (e: ChangeEvent<HTMLInputElement>, uid: number) => {
    e.preventDefault();

    if (!e.target || !e.target.files) {
        return;
    }

    let formData = new FormData();
    formData.append('avatar', e.target.files[0]);

    const [err, result] = await handlePromise<AxiosResponse<any, any>>(setPfp(formData))

    if (err) {
        createNotification({
            text: err.data.response,
        });
        return;
    }

    const data = result?.data;

    if (!data || !("success" in data) || !("response" in data)) {
        createNotification({
            text: "SERVER ERROR (C-UPFP)",
        });
        return;
    }

    if (!data.success) {
        createNotification({
            text: data.response,
        });
        return;
    }

    createNotification({
        text: data.response,
    });

    updateCacheFromUser(uid);
}
