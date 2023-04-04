import { useEffect, useState } from "react"
import { destroyNotificationByID } from "../../scripts/layout/notificationManager";
import { INotificationDetailsWithID } from "../../types/layout"

export type Props = {
    details: INotificationDetailsWithID,
}

export default function Notification({ details }: Props) {
    const [width, setWidth] = useState(100);

    useEffect(() => {
        let seconds = 0;
        setTimeout(() => {
            seconds++;
        }, 1000);
    }, [])

    return (
        <div className="w-[32rem] bg-[var(--jet)] flex flex-col justify-center items-start deep-shadow">
            <span className="h-[3px] w-full bg-[var(--dark-jet)] relative top-0 left-0">
                <span className="h-[3px] w-3/4 bg-[var(--blue-violet)] absolute top-0 left-0" />
            </span>
            <p className="text-xl font-medium ml-2 mt-2 mb-[0.35rem] whitespace-break-spaces">{details.text}</p>
        </div>
    )
}
