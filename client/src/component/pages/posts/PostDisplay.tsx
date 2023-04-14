import { AxiosResponse } from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deletePost } from '../../../scripts/api/posts'
import { createNotification } from '../../../scripts/layout/notificationManager'
import { formatDate, getPfp } from '../../../scripts/layout/profile'
import handlePromise from '../../../scripts/promiseHandler'
import { RootState } from '../../../store'
import UserContainer from '../../extras/UserContainer'
import ShineButton from '../../inputs/ShineButton'

type Props = {
    postData: any
}

export default function PostDisplay({ postData }: Props) {
    const user = useSelector((state: RootState) => state.user.value)
    const navigate = useNavigate();

    const handleDeletePost = async () => {
        const [err, res] = await handlePromise<AxiosResponse<any, any>>(deletePost());
        if (err) {
            createNotification({
                text: err.data.response
            })
            return;
        }

        if (!res || !res.data.success) {
            createNotification({
                text: "SERVER ERROR (CDP-NRD)"
            })
            return;
        }

        createNotification({
            text: "Successfully deleted post"
        })
        navigate("/");
    }
    return (
        <>
            <span className="w-full h-[2px] bg-[var(--blue-violet)]" />
            <div className="p-2">
                <div className="flex flex-row justify-between">
                    <p className="text-3xl font-bold">{postData.response.name}</p>
                    <div className="flex flex-row items-start">
                        <div className="flex flex-col items-end mr-2">
                            <UserContainer className={"!text-2xl !font-bold"} user={{ uid: postData.response.profile_id, role: postData.response.profile_role, name: postData.response.profile_name }} />
                            <p>{formatDate(postData.response.postdate)}</p>
                        </div>
                        <img className="rounded-full h-16 w-16" src={getPfp(postData.response.profile_pfp)} />
                    </div>
                </div>
                <div className="flex flex-row justify-between mt-6">
                    <p className="mt-4 text-xl font-light max-w-xl">{postData.response.content}</p>
                    {postData.response.profile_id == user.uid && (
                        <ShineButton
                            onClick={() => {
                                handleDeletePost();
                            }}
                            className="!px-2"
                        >
                            <img className="w-8 h-8" src={`${window.location.origin}/images/trashcan-white.svg`} />
                        </ShineButton>
                    )}
                </div>
            </div>
        </>
    )
}



