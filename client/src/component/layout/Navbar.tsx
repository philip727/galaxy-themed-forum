import { clear } from "console";
import { NavLink } from "react-router-dom";
import { setAuthTokenHeader } from "../../scripts/auth/headers";
import { deleteJWTCookie } from "../../scripts/auth/login";
import { IJWTInfo } from "../../types/auth";
import ShineButton from "../extras/ShineButton";

type Props = {
    clearUser: () => void,
    userDetails: IJWTInfo,
}

export default function Navbar({ userDetails, clearUser }: Props) {
    return (
        <div className="deep-shadow h-20 bg-[var(--jet)] flex justify-center items-center z-[999] absolute w-screen">
            <div className="w-1/3">
            </div>
            <div className="w-1/3 grid justify-center">
                <h1 className="text-center text-4xl font-extrabold"><span className="text-[var(--blue-violet)]">GALAXY</span>FORUMS</h1>
            </div>
            <div className="w-1/3 flex justify-end items-center px-28 gap-8">
                {userDetails.username.length == 0 && userDetails.uid < 0 && (
                    <>
                        <NavLink to="/register">
                            <ShineButton key={1}>
                                <p className="font-bold text-xl" >Register</p>
                            </ShineButton>
                        </NavLink>
                        <NavLink to="/login">
                            <ShineButton key={2}>
                                <p className="font-bold text-xl">Login</p>
                            </ShineButton>
                        </NavLink>
                    </>
                )}
                {userDetails.username.length > 0 && userDetails.uid >= 0 && (
                    <ShineButton onClick={clearUser}>
                        <p className="font-bold text-xl">Logout</p>
                    </ShineButton>
                )}
            </div>
        </div>
    )
}
