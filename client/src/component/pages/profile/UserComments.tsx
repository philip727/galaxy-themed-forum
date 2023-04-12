import { AxiosResponse } from "axios"
import { useSelector } from "react-redux"
import { deleteCommentById } from "../../../scripts/api/users"
import { createNotification } from "../../../scripts/layout/notificationManager"
import { formatDate, getPfp } from "../../../scripts/layout/profile"
import handlePromise from "../../../scripts/promiseHandler"
import { RootState } from "../../../store"
import UserContainer from "../../extras/UserContainer"
import ShineButton from "../../inputs/ShineButton"

type Props = {
    userComments: { success: any, response: any }
}

export default function UserComments({ userComments }: Props) {
    const user = useSelector((state: RootState) => state.user.value)
    return (
        <>
            {userComments.success && (
                <div className="w-full mt-2 flex flex-col-reverse">
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
                                <ShineButton onClick={() => { deleteCommentOnProfile(comment.id) }} className="!px-2 absolute top-2 right-0">
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
