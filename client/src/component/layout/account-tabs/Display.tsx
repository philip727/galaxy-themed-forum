import axios, { AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { ChangeEvent } from "react"
import { useSelector } from "react-redux";
import { setPfp, clearPfp } from "../../../scripts/api/account";
import { createNotification } from "../../../scripts/layout/notificationManager";
import { getPfp } from "../../../scripts/layout/profile";
import handlePromise from "../../../scripts/promiseHandler";
import { updateCacheFromUser } from "../../../scripts/utils/cache";
import { RootState } from "../../../store";
import "./Display.scss";

export default function Display() {
    const cache = useSelector((state: RootState) => state.cache.value)
    const user = useSelector((state: RootState) => state.user.value);

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

        updateCacheFromUser(user.uid);
    }

    const onClickClear = async (_: any) => {
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

        updateCacheFromUser(user.uid);
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Avatar</h1>
            <div className="relative mt-2">
                <img className="w-28 h-28 rounded-full thin-shadow" src={getPfp(cache.pfp)} />
                <motion.label
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, delay: 0 }}
                    className="w-10 h-10 bg-[var(--blue-violet)] thin-shadow absolute bottom-0 rounded-full cursor-pointer flex flex-row justify-center items-center"
                >
                    <img className="h-6 w-6" src="images/pencil-white.svg" />
                    <input className="image-upload" onChange={handleChange} accept="image/png, image/gif, image/jpeg" type="file" name="avatar" />
                </motion.label>
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, delay: 0 }}
                    className="w-10 h-10 bg-[var(--full-red)] absolute bottom-0 thin-shadow right-0 rounded-full cursor-pointer flex flex-row justify-center items-center"
                    onClick={onClickClear}
                >
                    <img className="h-6 w-6" src="images/cross-white.svg" />
                </motion.div>
            </div>
        </div>
    )
}
