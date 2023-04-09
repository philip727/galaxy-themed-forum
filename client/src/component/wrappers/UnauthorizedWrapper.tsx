import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../store";

export default function UnauthorizedWrapper() {
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticed)

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />
}
