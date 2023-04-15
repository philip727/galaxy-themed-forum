import { determineClass, formatDate, getPfp } from "../../../scripts/layout/profile"
import { ServerResponse } from "../../../types/response";

type Props = {
    userInfo: ServerResponse<RetrievedData>,
}

type RetrievedData = {
    bio: string,
    name: string,
    pfpdestination: string,
    regdate: string,
    role: string,
    uid: number
}

export default function UserInfo({ userInfo }: Props) {
    return (
        <div className="container w-[50rem] flex flex-col items-start">
            <span className="h-[2px] w-full bg-[var(--blue-violet)]" />
            {userInfo.success && (
                <div className="flex flex-row ml-8 my-8">
                    <img className="h-32 w-32 rounded-[50%]" src={getPfp(userInfo.response.pfpdestination)} />
                    <div className="flex flex-col ml-4">
                        <p className="font-extrabold text-4xl">{userInfo.response.name}</p>
                        <p className={`${determineClass(userInfo.response.role as string)} text-2xl`}>{userInfo.response.role}</p>
                        <div className="">
                            <p className="font-semibold text-lg">Regsister Date: {formatDate(userInfo.response.regdate)}</p>
                        </div>
                    </div>
                </div>
            )}
            {!userInfo.success && (
                <p className="font-extrabold text-3xl my-2 ml-3">This user does not exist</p>
            )}
        </div>
    )
}
