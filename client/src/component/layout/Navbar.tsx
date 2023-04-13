import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPfp } from "../../scripts/layout/profile";
import { RootState } from "../../store";
import ShineButton from "../inputs/ShineButton";
import Dropdown from "./navbar/Dropdown";

export default function Navbar() {
    const [userNav, setUserNav] = useState(false);
    const cache = useSelector((state: RootState) => state.cache.value)
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticed)
    const closeNav = () => {
        setUserNav(false);
    }

    return (
        <div className="deep-shadow pt-2 pb-3 lg:py-0 lg:h-20 bg-[var(--jet)] flex flex-col lg:flex-row justify-center items-center z-[999] absolute w-screen">
            <div className="w-1/3 hidden lg:block">
            </div>
            <div className="w-1/3 grid justify-center items-center">
                <Link to="/">
                    <h1 className="text-center text-4xl font-extrabold cursor-pointer">
                        <span className="text-[var(--blue-violet)]">GALAXY</span>
                        FORUMS
                    </h1>
                </Link>
            </div>
            <div className="w-full lg:w-1/3 flex justify-between lg:justify-end items-center px-4 2xl:pr-24 lg:gap-4 xl:gap-8 mt-2 lg:mt-0">
                {!isAuthenticated && (
                    <>
                        <Link to="/register">
                            <ShineButton>
                                <p className="font-bold text-xl" >Sign Up</p>
                            </ShineButton>
                        </Link>
                        <Link to="/login">
                            <ShineButton>
                                <p className="font-bold text-xl">Login</p>
                            </ShineButton>
                        </Link>
                    </>
                )}
                {isAuthenticated && (
                    <div className="relative">
                        <motion.img
                            onClick={() => { setUserNav(!userNav) }}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.3, delay: 0 }}
                            className="h-12 w-12 rounded-[50%] cursor-pointer"
                            src={getPfp(cache.pfp)}
                        />
                        {userNav && (
                            <Dropdown closeNav={closeNav} />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
