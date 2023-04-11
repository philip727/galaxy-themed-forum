import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store";

export function PrivateWrapper() {
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticed)

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export function UnAuthorizedWrapper() {
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticed)

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />
}
