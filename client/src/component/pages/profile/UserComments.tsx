import { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { deleteCommentById, getUserComments } from "../../../scripts/api/users"
import { createNotification } from "../../../scripts/layout/notificationManager"
import { formatDate, getPfp } from "../../../scripts/layout/profile"
import handlePromise from "../../../scripts/promiseHandler"
import { RootState } from "../../../store"
import { ServerResponse } from "../../../types/response"
import UserContainer from "../../extras/UserContainer"
import ShineButton from "../../inputs/ShineButton"

type Props = {
    retrievedComments: ServerResponse<UserCommentInfo[]>
    profileId: string,
    addCommentCallback: (fn: () => void) => void,
}

export type UserCommentInfo = {
    content: string,
    id: number,
    pfpdestination: string,
    post_date: string,
    poster_id: number,
    poster_name: string,
    poster_role: string,
}

export default function UserComments({ retrievedComments, profileId, addCommentCallback }: Props) {
    const user = useSelector((state: RootState) => state.user.value)
    const [comments, setComments] = useState(retrievedComments)

    // Deletes the comment and also updates
    const handleDeleteComment = async (commentId: number) => {
        await deleteCommentOnProfile(commentId)

        setComments(await updateCommentsOnProfile(parseInt(profileId)));
    }

    // Updates the comments on callback, this is used in the post comment component so we don't
    useEffect(() => {
        addCommentCallback(async () => {
            setComments(await updateCommentsOnProfile(parseInt(profileId)));
        })
    }, []);

    // Sets the comments when retreieved comments change, this is so when we go to a new profile we change the comments :D
    useEffect(() => {
        setComments(retrievedComments);
    }, [retrievedComments])

    return (
        <>
            {comments.success && (
                <div className="w-full mt-2 flex flex-col-reverse">
                    {Array.isArray(comments.response) && typeof comments.response.map == "function" &&
                        comments.response.map((comment: any, index: any) => (
                            <div key={index} className="w-full py-2 flex flex-row relative">
                                <img className="h-16 w-16 rounded-[50%] ml-2" src={getPfp(comment.pfpdestination)} />
                                <div className="pl-3 flex flex-col items-start justify-start">
                                    <div className="flex flex-row justify-center items-center">
                                        <UserContainer className="text-2xl" user={{ uid: comment.poster_id, name: comment.poster_name, role: comment.poster_role }} />
                                        <p className="text-lg ml-2 mt-1"> - {formatDate(comment.post_date)}</p>
                                    </div>
                                    <p className="text-md">{comment.content}</p>
                                </div>
                                {comment.poster_id == user.uid && (
                                    <ShineButton
                                        onClick={() => {
                                            handleDeleteComment(comment.id);
                                        }}
                                        className="!px-2 absolute top-2 right-0"
                                    >
                                        <img className="w-8 h-8" src={`${window.location.origin}/images/trashcan-white.svg`} />
                                    </ShineButton>
                                )}
                            </div>
                        ))}
                </div>
            )}
        </>
    )
}

const updateCommentsOnProfile = async (profileId: number): Promise<{ success: false, response: Array<any> }> => {
    const [err, result] = await handlePromise<AxiosResponse<any, any>>(getUserComments(profileId));

    if (err) {
        createNotification({
            text: err.data.response,
        })
        return { success: false, response: [] };
    }

    if (!result) {
        createNotification({
            text: "SERVER ERROR (C-DGCU)",
        })
        return { success: false, response: [] };
    }

    if (!result.data.success) {
        return { success: false, response: [] };
    }

    return result.data;
}

const deleteCommentOnProfile = async (commentId: number) => {
    let [err, result] = await handlePromise<AxiosResponse<any, any>>(deleteCommentById(commentId));
    if (err) {
        createNotification({
            text: err.data.response,
        })
        return;
    }

    if (!result) {
        createNotification({
            text: "SERVER ERROR (C-DCI)",
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
    });
}
