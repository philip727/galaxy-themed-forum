import axios from "axios";
import { motion } from "framer-motion";
import { json, Link, useLoaderData } from "react-router-dom"
import { SERVER_URL } from "../../scripts/config";
import SectionHeader from "../extras/SectionHeader";
import UserContainer from "../extras/UserContainer";
import CreatePost from "./category/CreatePost";

export default function Category() {
    const loaderData = useLoaderData() as any;
    const postsData = loaderData.posts.data;
    const infoData = loaderData.info.data;
    console.log(postsData)
    console.log(infoData)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-start items-center mt-20 gap-6"
        >
            {infoData.success && (
                <>
                    <SectionHeader className="w-[40rem]" headerText={infoData.response.name} />
                    <CreatePost />
                    {postsData.success && Array.isArray(postsData.response) && postsData.response.map((post: any, index: any) => (
                        <Link to={`/post/${post.id}`} key={index}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.3 * index } }}
                                whileHover={{ scale: 1.05, transition: { delay: 0 } }}
                                transition={{ duration: 0.2 }}
                                className="container w-[40rem] py-2 pl-2 flex flex-row justify-start items-center cursor-pointer"
                            >
                                <img className="h-12 w-12 rounded-full" src={`${SERVER_URL}${post.profile_pfp}`} />
                                <div className="ml-2">
                                    <p className="text-xl font-bold">{post.name}</p>
                                    <UserContainer user={{ uid: post.profile_id, name: post.profile_name, role: post.profile_role }} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </>
            )}
        </motion.div>
    )
}

export const categoryLoader = async ({ params }: { params: any }) => {
    const [posts, info] = await Promise.all([
        fetchCategoryPosts(params.id),
        fetchCategoryInfo(params.id),
    ])

    return json({ posts, info })
}

const fetchCategoryPosts = (id: number) => {
    return axios.request({
        url: `/api/categories/id/${id}/posts`,
        method: "GET",
    })
}

const fetchCategoryInfo = (id: number) => {
    return axios.request({
        url: `/api/categories/id/${id}`,
        method: "GET",
    })
}
