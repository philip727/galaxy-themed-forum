import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react"
import { INotificationDetailsWithID } from "../../types/layout"

export type Props = {
    details: INotificationDetailsWithID,
}

// Animations for the notification shrinking and fading away
const notificationAnimations = {
    hide: {
        opacity: 0
    },
    start: {
        opacity: 1
    },
    finish: {
        opacity: 0,
        scale: 0,
        transition: {
            duration: 0.2,
        }
    }
}

export default function Notification({ details }: Props) {
    const controls = useAnimationControls();
    details.seconds ??= 5;

    // Animation for the bar going from full to empty
    const barAnimation = {
        full: {
            scaleX: 1,
        },
        start: {
            scaleX: 0,
            transition: {
                duration: details.seconds,
            }
        }
    }

    useEffect(() => {
        controls.start("start");

        // Fade away and shrink
        const fadeAwayTimeoutId = setTimeout(() => {
            controls.start("finish");

            clearTimeout(fadeAwayTimeoutId);
            // @ts-ignore
        }, (details.seconds * 1000) - 200);
    }, []);

    return (
        <motion.div
            className="w-[32rem] bg-[var(--jet)] flex flex-col justify-center items-start deep-shadow"
            variants={notificationAnimations}
            initial="hide"
            animate={controls}
        >
            <span className="h-[3px] w-full bg-[var(--dark-jet)] relative top-0 left-0">
                <motion.span
                    className="h-[3px] w-full bg-[var(--blue-violet)] absolute top-0 left-0 origin-left"
                    variants={barAnimation}
                    initial="full"
                    animate={controls}
                />
            </span>
            <p className="text-xl font-medium ml-2 mt-2 mb-[0.35rem] whitespace-break-spaces">{details.text}</p>
        </motion.div>
    )
}
