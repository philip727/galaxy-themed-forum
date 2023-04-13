import axios from "axios";
import { motion } from "framer-motion";
import { json, useLoaderData } from "react-router-dom";
import { IHomeLoader } from "../../types/layout";
import Categories from "./home/Categories";
import UsersStatusInfo from "./home/UsersStatusInfo";

export default function Home() {
    const loaderData = useLoaderData() as IHomeLoader;
    const categories = loaderData.categories;
    const lastUser = loaderData.lastUser;
    const onlineUser = loaderData.onlineUsers;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-row justify-center items-start mt-20 gap-6"
        >
            <Categories categories={categories} />
            <UsersStatusInfo onlineUsers={onlineUser} lastUser={lastUser} />
        </motion.div>
    )
}

export const homeLoader = async () => {
    const [categories, lastUser, onlineUsers] = await Promise.all([
        fetchGeneralCategories(),
        fetchLastUser(),
        fetchOnlineUsers(),
    ])

    return json({ categories: categories.data, lastUser: lastUser.data, onlineUsers: onlineUsers.data });
}


const fetchGeneralCategories = () => {
    return axios.request({
        url: "/api/categories/general",
        method: "GET",
    })
}

const fetchLastUser = () => {
    return axios.request({
        url: "/api/user/last",
        method: "GET",
    })
}

const fetchOnlineUsers = () => {
    return axios.request({
        url: "/api/user/online",
        method: "GET",
    })
}
