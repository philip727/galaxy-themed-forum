import { AxiosResponse } from "axios";
import { ChangeEvent, useRef } from "react";
import { createNewPost } from "../../../scripts/api/posts";
import { createNotification } from "../../../scripts/layout/notificationManager";
import handlePromise from "../../../scripts/promiseHandler";
import InputArea from "../../inputs/InputArea";
import InputField from "../../inputs/InputField";
import ShineButton from "../../inputs/ShineButton";

export default function CreatePost() {
    const postInfo = useRef({
        title: "",
        content: "",
    })

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.target.name == "title" && e.target.value.length >= 30) {
            createNotification({
                text: "The title of a post can not be longer than 30 characters"
            })
            return;
        }

        if (e.target.name == "content" && e.target.value.length >= 1000) {
            createNotification({
                text: "The content of a post can not be longer than 1000 characters"
            })
            return;
        }

        postInfo.current = { ...postInfo.current, [e.target.name]: e.target.value }
    }

    return (
        <div className="container w-[40rem] px-6 pt-2 pb-4">
            <p className="text-xl font-bold mb-2">Create a post</p>
            <InputField maxLength={30} onChange={handleChange} name="title" className="w-full" placeholder="Post title" />
            <InputArea
                name="content"
                maxLength={120}
                placeholder="Add comment..."
                className="mt-4 w-full !h-24 min-h-[5rem] mb-3"
                areaClassName="!px-4 pt-2"
                onChange={handleChange}
            />
            <ShineButton onClick={() => handleNewPost(postInfo.current)}>
                <p className="text-xl font-medium">Create Post</p>
            </ShineButton>
        </div>
    )
}

const handleNewPost = async (postInfo: { title: string, content: string }) => {
    const [err, result] = await handlePromise<AxiosResponse<any, any>>(createNewPost(postInfo));
    if (err) {
        createNotification({
            text: err.data.response,
        })
        return;
    }

    if (!result) {
        createNotification({
            text: "SERVER ERROR (C-CNP)",
        })
        return;
    }

    if (!result.data.success) {
        createNotification({
            text: result.data.response,
        })
        return;
    }

    createNotification({
        text: result.data.response,
    })
}
