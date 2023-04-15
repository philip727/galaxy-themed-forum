import axios, { AxiosResponse } from 'axios';
import { motion } from 'framer-motion';
import { json, useLoaderData, useParams } from 'react-router-dom'
import { getPostComments } from '../../scripts/api/posts';
import { ServerResponse } from '../../types/response';
import PostComment from './posts/PostComment';
import PostDisplay from './posts/PostDisplay';
import UserComments from './posts/UserComments';

type CommentsData = {
    content: string,
    id: number,
    pfpdestination: null | string,
    post_date: string,
    poster_id: number,
    poster_name: string,
    poster_role: string,
}

type CategoryInfo = {
    category_id: number,
    content: string,
    id: number,
    name: string,
    postdate: string,
    profile_id: number,
    profile_name: string,
    profile_pfp: string,
    profile_role: string,
}

type PostLoaderData = {
    postComments: AxiosResponse<ServerResponse<CommentsData>>
    postInfo: AxiosResponse<ServerResponse<CategoryInfo>>
}


export default function Post() {
    const params = useParams();
    const loaderData = useLoaderData() as PostLoaderData;
    const commentsData = loaderData.postComments.data;
    const postData = loaderData.postInfo.data;

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
            {params.id && postData.success && (
                <>
                    <div className="container w-[50rem] flex flex-col">
                        <PostDisplay postData={postData} />
                    </div>
                    <div className="container w-[50rem] flex flex-col items-start px-3">
                        <PostComment callComments={callComments} />
                        <UserComments retrievedComments={commentsData} postId={parseInt(params.id)} addCommentCallback={addCommentCallback} />
                    </div>
                </>
            )}

        </motion.div>
    )
}

export const postLoader = async ({ params }: { params: any }) => {
    const [postInfo, postComments] = await Promise.all([
        fetchPostInfo(params.id),
        getPostComments(params.id),
    ])

    return json({ postInfo, postComments })
}

const fetchPostInfo = (id: number) => {
    return axios.request({
        url: `/api/posts/id/${id}`,
        method: "GET",
    })
}

