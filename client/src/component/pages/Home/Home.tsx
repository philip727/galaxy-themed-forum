import axios, { AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import handlePromise from "../../../scripts/promiseHandler";
import { ICategoryDetails } from "../../../types/layout";
import CategoryContainer from "../../extras/CategoryContainer";

export default function Home() {
    const [categories, setCategories] = useState<ICategoryDetails[] | null>(null);

    const updateCategories = async () => {
        const [err, res] = await handlePromise<AxiosResponse<any, any>>(requestCategories());
        if (err) {
            return;
        }

        const data = res?.data;
        if (!data.success) {
            return;
        }

        // Sets the state of the categories to the ones we have received from the api 
        const receivedCategories = data.response;
        setCategories(receivedCategories);
    }


    // There is a good reason why I dont use loaders
    useEffect(() => {
        updateCategories();
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-start items-center mt-20 gap-6"
        >
            <div className="container w-[30rem]">
                <div className="flex flex-col justify-start items-start pb-1">
                    <span className="w-full h-[2px] bg-[var(--blue-violet)]" />
                    <p className="mt-1 text-2xl font-bold ml-2">General</p>
                </div>
            </div>
            {categories && (
                <>
                    {categories.map((category, index) => (
                        <CategoryContainer key={index} name={category.name} description={category.description} categoryId={category.CID}/>
                    ))}
                </>
            )}
        </motion.div>
    )
}

const requestCategories = async () => {
    return axios.request({
        url: "/api/categories/general",
        method: "GET",
    })
}
