import axios from 'axios';
import { motion } from 'framer-motion';
import { json, useLoaderData, useParams } from 'react-router-dom'
import SectionHeader from '../extras/SectionHeader';

export default function Post() {
    const loaderData = useLoaderData() as any;
    const commentsData = loaderData.postComments.data;
    const postData = loaderData.postInfo.data;
    console.log(postData)
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-start items-center mt-20 gap-6"
        >
            {postData.success && (
                <>
                    <SectionHeader className="w-[40rem]" headerText={postData.response.name} />
                </>
            )}

        </motion.div>
    )
}

export const postLoader = async ({ params }: { params: any }) => {
    const [postInfo, postComments] = await Promise.all([
        fetchPostInfo(params.id),
        fetchPostComments(params.id),
    ])

    return json({ postInfo, postComments })
}

const fetchPostInfo = (id: number) => {
    return axios.request({
        url: `/api/posts/id/${id}`,
        method: "GET",
    })
}

const fetchPostComments = (id: number) => {
    return axios.request({
        url: `/api/posts/id/${id}/comments`,
        method: "GET",
    })
}
