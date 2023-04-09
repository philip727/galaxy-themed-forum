import { motion } from "framer-motion"
import { ModalDetails, ModalFunctionTypes } from "../../types/layout"
import ShineButton from "../inputs/ShineButton";

type Props = {
    modalDetails: ModalDetails,
    destroyModal: () => void,
}

const modalAnimations = {
    hide: {
        opacity: 0,
    },
    show: {
        opacity: 1,
    }
}

export default function Modal({ modalDetails, destroyModal }: Props) {
    const onButtonPress = (fn: ModalFunctionTypes | (() => void)) => {
        if (typeof fn == 'function') {
            fn();
            return;
        }

        switch (fn) {
            case ModalFunctionTypes.CLOSE:
                destroyModal();
                break;
        }
    }

    return (
        <motion.div
            className="h-fit w-[34rem] bg-[var(--jet)] flex flex-col justify-start items-center pb-4"
            variants={modalAnimations}
            initial="hide"
            animate="show"
            transition={{duration: 0.3}}
        >
            <span className="h-[2px] w-full bg-[var(--blue-violet)]" />
            <div className="w-full flex justify-center items-center mt-2">
                <div className="w-1/3" />
                <div className="w-1/3 grid justify-center items-center align-middle">
                    <h1 className="text-center font-extrabold text-3xl">{modalDetails.header}</h1>
                </div>
                <div className="w-1/3 grid justify-end items-center align-middle h-12 pr-7">
                    <h1
                        className="font-extrabold text-center text-3xl text-[var(--floral-white)] cursor-pointer hover:text-[var(--blue-violet)]
                        transition-colors duration-300"
                        onClick={() => {
                            destroyModal();
                        }}
                    >
                        X
                    </h1>
                </div>
            </div>
            <div className="h-fit grid justify-center items-center mt-6 py-2 w-3/4 bg-[var(--dark-jet)] rounded-xl">
                <p className="text-2xl font-medium text-center" >{modalDetails.subtext}</p>
            </div>
            <div className="mt-6 flex justify-center items-center gap-12">
                {modalDetails.buttons.map((button, index) => {
                    return (
                        <ShineButton key={index} onClick={() => { onButtonPress(button.fn) }}>
                            <p>{button.text}</p>
                        </ShineButton>
                    )
                })}
            </div>
        </motion.div>
    )
}
