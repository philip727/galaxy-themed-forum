import axios from "axios";
import { motion } from "framer-motion";
import { json, Link, useLoaderData } from "react-router-dom";
import { IHomeLoader } from "../../types/layout";
import CategoryContainer from "../extras/CategoryContainer";
import SectionHeader from "../extras/SectionHeader";
import UserContainer from "../extras/UserContainer";

export default function Home() {
    const loaderData = useLoaderData() as IHomeLoader;
    const categories = loaderData.categories;
    const lastUser = loaderData.lastUser;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-row justify-center items-start mt-20 gap-6"
        >
            <div className="flex flex-col justify-start items-center gap-6">
                <SectionHeader widthClass="w-[30rem]" headerText="General" />
                {categories.success && (
                    <>
                        {categories.response.map((category, index) => (
                            <Link key={index} to={`/category/${category.CID}`}>
                                <CategoryContainer name={category.name} description={category.description} categoryId={category.CID} />
                            </Link>
                        ))}
                    </>
                )}
            </div>
            <div className="flex flex-col justify-start items-center gap-6">
                <SectionHeader widthClass="w-[15rem]" headerText="Users" />
                <div className="container w-[15rem] px-2 py-1">
                    <div className="h-[10rem]">
                        <p className="font-bold">Online users:</p>
                    </div>
                    {lastUser.success && (
                        <div className="flex flex-row">
                            <p className="mr-1">Newest user: </p>
                            <UserContainer user={lastUser.response} />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export const homeLoader = async () => {
    const [categories, lastUser] = await Promise.all([
        fetchGeneralCategories(),
        fetchLastUser(),
    ])

    return json({ categories: categories.data, lastUser: lastUser.data });
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
