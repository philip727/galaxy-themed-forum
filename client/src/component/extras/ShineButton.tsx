import { ReactNode } from 'react'

type Props = {
    children?: ReactNode,
}

export default function ShineButton({children}: Props) {
    return (
        <div className="h-12 w-fit px-6 rounded-xl bg-[var(--blue-violet)] flex justify-center items-center thin-shadow cursor-pointer">
            {children}
        </div>
    )
}
