import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../scripts/auth/login";
import './Dropdown.scss';

type Props = {
    uid: number,
    closeNav: () => void,
}

type NavItems = {
    [key: string]: { img: string, fn: () => void }
}

export default function Dropdown({ uid, closeNav }: Props) {
    const navigate = useNavigate();
    const userNavItems: NavItems = {
        "Profile": {
            "img": `${window.location.origin}/images/profile-white.svg`,
            fn: (): void => {
                closeNav();
                navigate(`/profile/${uid}`)
            }
        },
        "Account": {
            "img": `${window.location.origin}/images/settings-white.svg`,
            fn: (): void => {
                closeNav();
                navigate("/account")
            }
        },
        "Logout": {
            "img": `${window.location.origin}/images/exit-white.svg`,
            fn: (): void => {
                closeNav();
                logoutUser();
            }
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 right-0 container h-fit w-32 pb-2 pr-2"
        >
            {Object.keys(userNavItems).map((key, i) => (
                <div 
                    key={i} className="flex flex-row justify-center items-center dropdown cursor-pointer"
                    onClick={userNavItems[key].fn}
                >
                    <p className="mt-2 w-full text-right text-lg font-semibold cursor-pointer" >
                        {key}
                    </p>
                    <img src={userNavItems[key].img} className="h-6 w-6 mt-2 ml-2" />
                </div>
            ))}
        </motion.div>
    )
}
