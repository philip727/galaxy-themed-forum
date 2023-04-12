import { motion } from "framer-motion";
import { json, useLoaderData } from "react-router-dom";
import { getUserByUID, getUserComments } from "../../scripts/api/users";
import { determineClass, formatDate, getPfp } from "../../scripts/layout/profile";
import UserContainer from "../extras/UserContainer";

export default function Profile() {
    const loaderData: any = useLoaderData();
    const userInfo = loaderData.userInfo.data;
    const userComments = loaderData.userComments.data;

    console.log(userComments);
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
                        <div className="w-full mt-2 min-h-[5rem]">
                            {userComments.success && (
                                <>
                                    {userComments.response.map((comment: any, index: any) => (
                                        <div key={index} className="w-full py-2 flex flex-row">
                                            <img className="h-16 w-16 rounded-[50%] ml-2" src={getPfp(comment.pfpdestination)} />
                                            <div className="pl-3 flex flex-col items-start justify-start">
                                                <div className="flex flex-row justify-center items-center">
                                                    <UserContainer className="text-2xl" user={{ uid: comment.poster_id, name: comment.poster_name, role: comment.poster_role }} />
                                                    <p className="text-lg ml-2 mt-1"> - {formatDate(comment.post_date)}</p>
                                                </div>
                                                <p className="text-md">{comment.content}</p>
                                            </div>
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
