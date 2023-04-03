import { ReactNode } from 'react'
import { NavLink } from "react-router-dom";
import { motion } from 'framer-motion'

type Props = {
    children?: ReactNode,
    to?: string,
    onClick?: any,
}

export default function ShineButton({ children, to, onClick}: Props) {
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
        <NavLink to={to ? to : ""}>
            <motion.div
                variants={buttonAnimations}
                whileHover="hover"
                onClick={onClick}
                className="h-12 w-fit px-6 rounded-xl bg-[var(--blue-violet)] flex justify-center items-center thin-shadow cursor-pointer"
            >
                {children}
            </motion.div>
        </NavLink>
    )
}
