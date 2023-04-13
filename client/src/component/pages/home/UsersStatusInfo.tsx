import SectionHeader from "../../extras/SectionHeader"
import UserContainer from "../../extras/UserContainer"

type Props = {
    onlineUsers: any,
    lastUser: any,
}

export default function UsersStatusInfo({ onlineUsers: onlineUser, lastUser }: Props) {
    return (
        <div className="flex flex-col justify-start items-center gap-6">
            <SectionHeader widthClass="w-[15rem]" headerText="Users" />
            <div className="container w-[15rem] px-2 py-1">
                <div className="h-[10rem] overflow-y-scroll online-users">
                    <p className="font-bold">Online users:</p>
                    {onlineUser.success && (
                        <>
                            {onlineUser.response.map((user: any, index: number) => (
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
