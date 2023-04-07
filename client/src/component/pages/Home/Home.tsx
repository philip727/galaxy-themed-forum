import axios from "axios";
import { useEffect, useState } from "react";
import { ICategoryDetails } from "../../../types/layout";
import Container from "../../layout/blocks/Container";

export default function Home() {
    const [categories, setCategories] = useState<ICategoryDetails[] | null>(null);

    // There is a good reason why I dont use loaders
    useEffect(() => {
        if (categories) {
            return;
        }
        requestCategories()
            .then(response => {
                const data = response.data;
                if (!data.success) {
                    return;
                }

                const receivedCategories = data.response;
                setCategories(receivedCategories);
            })
            .catch(err => {

            })

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
    const res = axios.request({
        url: "/api/posts/getcategories",
        method: "GET",
    })


    return res;
}
