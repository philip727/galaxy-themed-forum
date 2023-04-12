type Props = {
    userInfo: { success: any, response: any }
}

export default function Bio({ userInfo }: Props) {
    return (
        <div className="container w-[50rem] flex flex-col items-start px-3 pb-3">
            <h1 className="mt-2 text-2xl font-bold">{userInfo.response.name}'s Bio</h1>
            <div className="bg-[var(--dark-jet)] w-full mt-2 inset-shadow h-[7.5rem] px-2">
                <p className="mt-1 text-lg break-words">{
                    userInfo.response.bio ? userInfo.response.bio : `${userInfo.response.name} has no bio yet.`
                }</p>
            </div>
        </div>
    )
}
