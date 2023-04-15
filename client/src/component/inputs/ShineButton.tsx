import { ReactNode } from 'react'
import { motion } from 'framer-motion'

type Props = {
    children?: ReactNode,
    onClick?: any,
    className?: string,
}

export default function ShineButton({ children, onClick, className }: Props) {
    const buttonAnimations = {
        hover: {
            scale: 1.05,
            transition: {
                delay: 0,
                duration: 0.2,
            }
        }
    }

    return (
        <motion.div
            variants={buttonAnimations}
            whileHover="hover"
            onClick={onClick}
            className={`h-12 w-fit px-6 rounded-xl bg-[var(--blue-violet)] flex justify-center items-center thin-shadow cursor-pointer ${className}`}
        >
            {children}
        </motion.div>
    )
}
