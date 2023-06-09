import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { deleteCommentByIdOnPost, getPostComments } from '../../../scripts/api/posts'
import { createNotification } from '../../../scripts/layout/notificationManager'
import { formatDate, getPfp } from '../../../scripts/layout/profile'
import handlePromise from '../../../scripts/promiseHandler'
import { RootState } from '../../../store'
import { ServerResponse } from '../../../types/response'
import UserContainer from '../../extras/UserContainer'
import ShineButton from '../../inputs/ShineButton'

type Props = {
    retrievedComments: ServerResponse<PostCommentInfo>
    postId: number,
    addCommentCallback: (fn: () => void) => void,
}

type PostCommentInfo = {
    content: string,
    id: number,
    pfpdestination: string | null,
    post_date: string,
    poster_id: number,
    poster_name: string,
    poster_role: string,
}

export default function UserComments({ retrievedComments, postId, addCommentCallback }: Props) {
    const user = useSelector((state: RootState) => state.user.value)
    const [comments, setComments] = useState<ServerResponse<PostCommentInfo | null>>(retrievedComments)

    // Deletes the comment and also updates
    const handleDeleteComment = async (commentId: number) => {
        await deleteCommentOnPost(commentId)

        setComments(await updateCommentsOnPost(postId));
    }

    // Updates the comments on callback, this is used in the post comment component so we don't
    useEffect(() => {
        addCommentCallback(async () => {
            setComments(await updateCommentsOnPost(postId));
        })
    }, []);

    // Sets the comments when retreieved comments change, this is so when we go to a new profile we change the comments :D
    useEffect(() => {
        setComments(retrievedComments);
    }, [retrievedComments])
    return (
        <>
            {comments.success && (
                <div className="w-full mt-2 flex flex-col-reverse mb-2">
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

const updateCommentsOnPost = async (postId: number): Promise<ServerResponse<PostCommentInfo | null>> => {
    const [err, result] = await handlePromise<AxiosResponse<any, any>>(getPostComments(postId));

    if (err) {
        createNotification({
            text: err.data.response,
        })
        return { success: false, response: null };
    }

    if (!result) {
        createNotification({
            text: "SERVER ERROR (C-DGCU)",
        })
        return { success: false, response: null };
    }

    if (!result.data.success) {
        return { success: false, response: null };
    }

    return result.data;
}

const deleteCommentOnPost = async (commentId: number) => {
    let [err, result] = await handlePromise<AxiosResponse<any, any>>(deleteCommentByIdOnPost(commentId));
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
