import axios from "axios";
import { motion } from "framer-motion";
import { useLoaderData, useParams } from "react-router-dom";

export default function Profile() {
    const loaderData: any = useLoaderData();
    const data = loaderData.data;

    const determineClass = (role: string): string => {
        switch (role) {
            case "admin":
                return "font-extrabold text-[var(--admin-colour)] admin-container";
            case "moderator":
                return "font-bold text-[var(--moderator-colour)]";
        }
        return "font-bold text-[var(--floral-white)]"
    }
    
    const formatDate = (sqlDate: string): string => {
        const americanDate = sqlDate.split("T")[0];
        const americanArr = americanDate.split("-"); 
        
        const day = americanArr[2];
        const month = americanArr[1];
        const year = americanArr[0]


        return `${day}/${month}/${year}`;
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-row justify-center items-start mt-20 gap-6"
        >
            <div className="container w-[50rem] flex flex-col items-start pb-8">
                <span className="h-[2px] w-full bg-[var(--blue-violet)]" />
                {data.success && (
                    <div className="flex flex-row mt-8 ml-8">
                        <img className="h-32 w-32 rounded-[50%]" src="/images/default-pfp.jpg" />
                        <div className="flex flex-col ml-4">
                            <p className="font-extrabold text-4xl">{data.response.name}</p>
                            <p className={`${determineClass(data.response.role as string)} text-2xl`}>{data.response.role}</p>
                            <div className="">
                                <p className="font-semibold text-lg">Regsister Date: {formatDate(data.response.regdate)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export const profileLoader = ({ params }: { params: any }) => {
    return axios.request({
        url: `/api/user/id/${params.id}`,
        method: "GET",
    })
}
