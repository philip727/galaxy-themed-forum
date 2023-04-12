import { AxiosResponse } from "axios";
import { ChangeEvent, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createUserComment } from "../../../scripts/api/users";
import { createNotification } from "../../../scripts/layout/notificationManager";
import handlePromise from "../../../scripts/promiseHandler";
import { RootState } from "../../../store";
import ShineButton from "../../inputs/ShineButton";

export default function PostComment() {
    const isAutenticated = useSelector((state: RootState) => state.user.isAuthenticed)
    const comment = useRef("");
    const textArea = useRef<HTMLTextAreaElement>(null);
    const [showButton, setShowButton] = useState(false);

    const handlePostCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length >= 120) {
            createNotification({
                text: "Comment can only be 120 characters long",
            })
            return;
        }
        comment.current = e.target.value;

        if (comment.current.length >= 1) {
            setShowButton(true);
            return;
        }

        setShowButton(false);
    }

    const handlePostComment = () => {
        if (comment.current.length <= 0) {
            createNotification({
                text: "Please fill in the text field",
            })
            return;
        }

        postCommentOnProfile(comment.current)

        // Removes the text from text area
        if (!textArea.current) {
            return;
        }
        textArea.current.value = "";
        setShowButton(false);
    }

    return (
        <>
            {isAutenticated && (
                <>
                    <textarea
                        ref={textArea}
                        onChange={handlePostCommentChange}
                        name="bio"
                        maxLength={120}
                        placeholder="Add comment.."
                        className="mt-2 w-full h-20 min-h-[5rem] pl-1 mb-3 inset-shadow bg-[var(--dark-jet)] resize-none"
                    />
                    {showButton && (
                        <div className="flex justify-end w-full">
                            <ShineButton onClick={() => {handlePostComment()}}>
                                <p className="text-xl font-medium">Post</p>
                            </ShineButton>
                        </div>
                    )}
                </>
            )}
        </>
    )
}

const postCommentOnProfile = async (comment: string) => {
    const [err, result] = await handlePromise<AxiosResponse<any, any>>(createUserComment(comment));
    if (err) {
        createNotification({
            text: err.data.response,
        })
        return;
    }

    if (!result) {
        createNotification({
            text: "SERVER ERROR (C-CUC)",
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
