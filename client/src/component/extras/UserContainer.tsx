import { Link } from "react-router-dom";
import { IPublicUserDetails } from "../../types/user"

type Props = {
    user: IPublicUserDetails,
}

export default function UserContainer({ user }: Props) {
    const determineClass = (): string => {
        switch (user.role) {
            case "admin":
                return "font-extrabold text-[var(--admin-colour)]";
            case "moderator":
                return "font-bold text-[var(--moderator-colour)]";
        }
        return "font-bold text-[var(--floral-white)]"
    }

    return (
        <Link to={`profile/${user.uid}`}>
            <p className={`${determineClass()}`}>{user.name}</p>
        </Link>
    )
}
