import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="h-24 ">
           <NavLink to="/register">Register</NavLink> 
           <NavLink to="/login">Login</NavLink> 
        </div>
    )
}
