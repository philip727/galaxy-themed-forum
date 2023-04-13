import { motion } from "framer-motion";
import { json, useLoaderData, useParams } from "react-router-dom";
import { getUserByUID, getUserComments } from "../../scripts/api/users";
import Bio from "./profile/Bio";
import PostComment from "./profile/PostComment";
import UserComments from "./profile/UserComments";
import UserInfo from "./profile/UserInfo";

export default function Profile() {
    const loaderData: any = useLoaderData();
    const params = useParams() as any;
    const userInfo = loaderData.userInfo.data;
    const userComments = loaderData.userComments.data;
    const commentCallbacks: Array<() => void> = []

    // Calls all the comment callbacks
    const callComments = () => {
        commentCallbacks.forEach(fn => {
            fn();
        })
    }

    // Adds a callback
    const addCommentCallback = (fn: () => void) => {
        commentCallbacks.push(fn);
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-start items-center mt-20 gap-6"
        >
            <UserInfo userInfo={userInfo} />
            {userInfo.success && (
                <>
                    <Bio userInfo={userInfo} />
                    <div className="container w-[50rem] flex flex-col items-start px-3 pb-3">
                        <h1 className="mt-2 text-2xl font-bold">{userInfo.response.name}'s Comments</h1>
                        <PostComment callComments={callComments} />
                        <UserComments retrievedComments={userComments} profileId={params.id} addCommentCallback={addCommentCallback} />
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


