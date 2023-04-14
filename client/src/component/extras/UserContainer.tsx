import { Link } from "react-router-dom";
import { IPublicUserDetails } from "../../types/user"

type Props = {
    user: IPublicUserDetails,
    className?: string,
}

export default function UserContainer({ user, className }: Props) {
    const determineClass = (): string => {
        switch (user.role) {
            case "admin":
                return "font-extrabold text-[var(--admin-colour)] admin-container";
            case "moderator":
                return "font-bold text-[var(--moderator-colour)]";
        }
        return "font-bold text-[var(--floral-white)]"
    }

    return (
        <Link to={`/profile/${user.uid}`} className="w-fit block">
            <p className={`${determineClass()} mt-0 ${className}`}>{user.name}</p>
        </Link>
    )
}
