import { ServerResponse } from "../../../types/response";
import { IPublicUserDetails, IPublicUserDisplay } from "../../../types/user";
import SectionHeader from "../../extras/SectionHeader"
import UserContainer from "../../extras/UserContainer"

type Props = {
    onlineUsers: ServerResponse<IPublicUserDetails[]>,
    lastUser: ServerResponse<IPublicUserDisplay>,
}

export default function UsersStatusInfo({ onlineUsers, lastUser }: Props) {
    return (
        <div className="flex flex-col justify-start items-center gap-6">
            <SectionHeader className="w-[15rem]" headerText="Users" />
            <div className="container w-[15rem] px-2 py-1">
                <div className="h-[10rem] overflow-y-scroll online-users">
                    <p className="font-bold">Online users:</p>
                    {onlineUsers.success && (
                        <>
                            {onlineUsers.response.map((user: IPublicUserDetails, index: number) => (
                                <UserContainer key={index} user={user} />
                            ))}
                        </>
                    )}
                </div>
                {lastUser.success && (
                    <div className="flex flex-row">
                        <p className="mr-1">Newest user: </p>
                        <UserContainer user={lastUser.response} />
                    </div>
                )}
            </div>
        </div>
    )
}
