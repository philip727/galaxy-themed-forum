import { NavLink, useNavigate } from "react-router-dom";
// import { createModal, destroyModal } from "../../scripts/layout/modalManager";
import { IJWTInfo } from "../../types/auth";
// import { ModalFunctionTypes } from "../../types/layout";
import ShineButton from "../extras/ShineButton";

type Props = {
    clearUser: () => void,
    userDetails: IJWTInfo,
}

export default function Navbar({ userDetails, clearUser }: Props) {
    const navigate = useNavigate();

    // const logoutUser = () => {
    //     createModal({
    //         header: "Logout",
    //         subtext: "Are you sure you would like to logout?",
    //         buttons: [
    //             {
    //                 text: "Yes",
    //                 fn: () => {
    //                     clearUser()
    //                     destroyModal();
    //                 },
    //             },
    //             {
    //                 text: "No",
    //                 fn: ModalFunctionTypes.CLOSE
    //             }
    //         ]
    //     });
    // }

    return (
        <div className="deep-shadow pt-2 pb-3 lg:py-0 lg:h-20 bg-[var(--jet)] flex flex-col lg:flex-row justify-center items-center z-[999] absolute w-screen">
            <div className="w-1/3 hidden lg:block">
            </div>
            <div className="w-1/3 grid justify-center items-center">
                <h1
                    className="text-center text-4xl font-extrabold cursor-pointer"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <span className="text-[var(--blue-violet)]">GALAXY</span>
                    FORUMS
                </h1>
            </div>
            <div className="w-full lg:w-1/3 flex justify-between lg:justify-end items-center px-4 2xl:pr-24 lg:gap-4 xl:gap-8 mt-2 lg:mt-0">
                {userDetails.username.length === 0 && userDetails.uid < 0 && (
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
                {userDetails.username.length > 0 && userDetails.uid >= 0 && (
                    <ShineButton>
                        <p className="font-bold text-xl">My Account</p>
                    </ShineButton>
                )}
            </div>
        </div>
    )
}
