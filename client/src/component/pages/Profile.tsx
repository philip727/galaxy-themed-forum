import { AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { json, useLoaderData } from "react-router-dom";
import { createUserComment, deleteCommentById, getUserByUID, getUserComments } from "../../scripts/api/users";
import { createNotification } from "../../scripts/layout/notificationManager";
import { determineClass, formatDate, getPfp } from "../../scripts/layout/profile";
import handlePromise from "../../scripts/promiseHandler";
import { RootState } from "../../store";
import UserContainer from "../extras/UserContainer";
import ShineButton from "../inputs/ShineButton";

export default function Profile() {
    const user = useSelector((state: RootState) => state.user.value)
    const loaderData: any = useLoaderData();
    const userInfo = loaderData.userInfo.data;
    const userComments = loaderData.userComments.data;

    const [postComment, setPostComment] = useState("");

    const handlePostCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length >= 120) {
            createNotification({
                text: "Comment can only be 120 characters long",
            })
            return;
        }
        setPostComment(e.target.value);
    }

    const postCommentOnProfile = async () => {
        const [err, result] = await handlePromise<AxiosResponse<any, any>>(createUserComment(postComment));
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

    const deleteCommentOnProfile = async (commentId: number) => {
        const [err, result] = await handlePromise<AxiosResponse<any, any>>(deleteCommentById(commentId));
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
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-start items-center mt-20 gap-6"
        >
            <div className="container w-[50rem] flex flex-col items-start">
                <span className="h-[2px] w-full bg-[var(--blue-violet)]" />
                {userInfo.success && (
                    <div className="flex flex-row ml-8 my-8">
                        <img className="h-32 w-32 rounded-[50%]" src={getPfp(userInfo.response.pfpdestination)} />
                        <div className="flex flex-col ml-4">
                            <p className="font-extrabold text-4xl">{userInfo.response.name}</p>
                            <p className={`${determineClass(userInfo.response.role as string)} text-2xl`}>{userInfo.response.role}</p>
                            <div className="">
                                <p className="font-semibold text-lg">Regsister Date: {formatDate(userInfo.response.regdate)}</p>
                            </div>
                        </div>
                    </div>
                )}
                {!userInfo.success && (
                    <p className="font-extrabold text-3xl my-2 ml-3">This user does not exist</p>
                )}
            </div>
            {userInfo.success && (
                <>
                    <div className="container w-[50rem] flex flex-col items-start px-3 pb-3">
                        <h1 className="mt-2 text-2xl font-bold">{userInfo.response.name}'s Bio</h1>
                        <div className="bg-[var(--dark-jet)] w-full mt-2 inset-shadow h-[7.5rem] px-2">
                            <p className="mt-1 text-lg break-words">{
                                userInfo.response.bio ? userInfo.response.bio : `${userInfo.response.name} has no bio yet.`
                            }</p>
                        </div>
                    </div>
                    <div className="container w-[50rem] flex flex-col items-start px-3 pb-3">
                        <h1 className="mt-2 text-2xl font-bold">{userInfo.response.name}'s Comments</h1>
                        <textarea
                            onChange={handlePostCommentChange}
                            name="bio"
                            maxLength={120}
                            placeholder="Add comment.."
                            className="mt-2 w-full h-20 min-h-[5rem] pl-1 mb-3 inset-shadow bg-[var(--dark-jet)] resize-none"
                        />
                        <div className="flex justify-end w-full">
                            {postComment.length > 0 && (
                                <ShineButton onClick={postCommentOnProfile}>
                                    <p className="text-xl font-medium">Post</p>
                                </ShineButton>
                            )}
                        </div>
                        <div className="w-full mt-2 min-h-[5rem]">
                            {userComments.success && (
                                <>
                                    {userComments.response.map((comment: any, index: any) => (
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
                                                <ShineButton onClick={() => { deleteCommentOnProfile(comment.id) }} className="absolute top-0 right-0">

                                                </ShineButton>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    )
}

export const profileLoader = async ({ params }: { params: any }) => {
    const [userInfo, userComments] = await Promise.all([
        getUserByUID(params.id),
        getUserComments(params.id),
    ])
    return json({ userInfo: userInfo, userComments: userComments });
}
