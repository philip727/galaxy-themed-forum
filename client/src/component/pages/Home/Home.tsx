import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import handlePromise from "../../../scripts/promiseHandler";
import { ICategoryDetails } from "../../../types/layout";
import Container from "../../layout/blocks/Container";

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
        <div
            className="flex flex-col justify-start items-center mt-20 gap-4"
        >
            {categories && (
                <>
                    {categories.map((category, index) => (
                        <Container key={index}>
                            <div className="flex flex-col justify-start items-center pb-1">
                                <span className="w-full h-[2px] bg-[var(--blue-violet)]" />
                                <div className="w-full mt-1">
                                    <h1 className="ml-2 font-medium text-2xl">{category.name}</h1>
                                    <p className="ml-2 font-light text-lg">{category.description}</p>
                                </div>
                            </div>
                        </Container>
                    ))}
                </>
            )}
        </div>
    )
}

const requestCategories = async () => {
    return axios.request({
        url: "/api/posts/getcategories",
        method: "GET",
    })
}
