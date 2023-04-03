import { NavLink } from "react-router-dom";
import { LoginDetails } from "../../types/user";
import ShineButton from "../extras/ShineButton";

type Props = {
    userDetails: LoginDetails,
}

export default function Navbar({ userDetails }: Props) {

    return (
        <div className="deep-shadow h-20 bg-[var(--jet)] flex justify-center items-center z-[999] absolute w-screen">
            <div className="w-1/3">
            </div>
            <div className="w-1/3 grid justify-center">
                <h1 className="text-center text-4xl font-extrabold"><span className="text-[var(--blue-violet)]">GALAXY</span>FORUMS</h1>
            </div>
            <div className="w-1/3 flex justify-end items-center px-28 gap-8">
                {!userDetails.isLoggedIn && userDetails.uid < 0 && (
                    <>
                        <ShineButton key={1}>
                            <NavLink to="/register" className="font-bold text-xl" >Register</NavLink>
                        </ShineButton>
                        <ShineButton key={2}>
                            <NavLink to="/login" className="font-bold text-xl">Login</NavLink>
                        </ShineButton>
                    </>
                )}
            </div>
        </div>
    )
}
