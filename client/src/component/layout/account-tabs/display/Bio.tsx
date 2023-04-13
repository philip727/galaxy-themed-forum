import { AxiosResponse } from "axios";
import { ChangeEvent, useRef } from "react";
import { useSelector } from "react-redux";
import { updateUser } from "../../../../reducers/user";
import { setBio } from "../../../../scripts/api/account";
import { createNotification } from "../../../../scripts/layout/notificationManager";
import handlePromise from "../../../../scripts/promiseHandler";
import store, { RootState } from "../../../../store";
import ShineButton from "../../../inputs/ShineButton";

export default function Bio() {
    const user = useSelector((state: RootState) => state.user.value);
    const userPersonalInfo = useRef({
        bio: "",
    })

    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.name === "bio" && e.target.value.length >= 200) {
            createNotification({
                text: "Bio can only be 200 characters long",
            })
            return;
        }

        userPersonalInfo.current = { ...userPersonalInfo.current, [e.target.name]: e.target.value }
    }

    if (user.bio) {
        userPersonalInfo.current.bio = user.bio;
    }

    return (
        <>
            <textarea
                name="bio"
                onChange={handleTextChange}
                maxLength={200}
                placeholder="Enter Bio..."
                className="mt-6 w-full h-40 min-h-[10rem] pl-1 mb-3 inset-shadow bg-[var(--dark-jet)] resize-none"
                defaultValue={user.bio}
            />
            <div className="w-full flex flex-row justify-end">
                <ShineButton onClick={() => updateBio(userPersonalInfo.current.bio)}>
                    <p className="font-bold text-xl">Update</p>
                </ShineButton>
            </div>
        </>
    )
}

const select = (state: RootState) => {
    return state.user.value;
}

const updateBio = async (bio: string) => {
    let user = select(store.getState());
    const [err, result] = await handlePromise<AxiosResponse<any, any>>(setBio(bio));
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

    store.dispatch(updateUser({ ...user, bio: bio }));
}
