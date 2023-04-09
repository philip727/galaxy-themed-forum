import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { RootState } from "../../store";
// import { createModal, destroyModal } from "../../scripts/layout/modalManager";
// import { ModalFunctionTypes } from "../../types/layout";
import ShineButton from "../inputs/ShineButton";

export default function Navbar() {
    const user = useSelector((state: RootState) => state.user.value)

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
                {user.username.length === 0 && user.uid < 0 && (
                    <>
                        <NavLink to="/register">
                            <ShineButton>
                                <p className="font-bold text-xl" >Sign Up</p>
                            </ShineButton>
                        </NavLink>
                        <NavLink to="/login">
                            <ShineButton>
                                <p className="font-bold text-xl">Login</p>
                            </ShineButton>
                        </NavLink>
                    </>
                )}
                {user.username.length > 0 && user.uid >= 0 && (
                    <NavLink to="/account">
                        <ShineButton>
                            <p className="font-bold text-xl">My Account</p>
                        </ShineButton>
                    </NavLink>
                )}
            </div>
        </div>
    )
}
