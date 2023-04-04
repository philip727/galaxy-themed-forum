import { motion } from "framer-motion"
import { ModalDetails } from "../../types/layout"
import ShineButton from "../extras/ShineButton";

type Props = {
    modalDetails: ModalDetails,
    destroyModal?: () => void,
}


export default function Modal({ modalDetails, destroyModal }: Props) {
    return (
        <motion.div className="h-fit w-[34rem] bg-[var(--jet)] flex flex-col justify-start items-center pb-4">
            <span className="h-[2px] w-full bg-[var(--blue-violet)]" />
            <div className="w-full flex justify-center items-center mt-2">
                <div className="w-1/3" />
                <div className="w-1/3 grid justify-center items-center align-middle h-12">
                    <h1 className="text-center font-extrabold text-3xl">{modalDetails.header}</h1>
                </div>
                <div className="w-1/3 grid justify-end items-center align-middle h-12 pr-7">
                    <h1
                        className="font-extrabold text-center text-3xl text-[var(--floral-white)] cursor-pointer hover:text-[var(--blue-violet)]
                        transition-colors duration-300"
                        onClick={() => {
                            if (destroyModal) {
                                destroyModal();
                            }
                        }}
                    >
                        X
                    </h1>
                </div>
            </div>
            <div className="h-fit grid justify-center items-center mt-6 py-2 w-3/4 bg-[var(--dark-jet)]">
                <p className="text-2xl font-medium text-center" >{modalDetails.subtext}</p>
            </div>
            <div className="mt-4 grid justify-center items-center">
                {modalDetails.buttons.map((button, index) => {
                    return (
                        <ShineButton key={index} onClick={button.fn}>
                            <p>{button.text}</p>
                        </ShineButton>
                    )
                })}
            </div>
        </motion.div>
    )
}
