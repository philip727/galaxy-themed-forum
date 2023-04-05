import { ReactNode } from "react"

type Props = {
    children?: ReactNode,
    width?: string,
}

export default function Container({ children, width }: Props) {
    width ??= "w-[30rem]";

    return (
        <div className={`bg-[var(--jet)] h-fit ${width} deep-shadow`}>
            {children}
        </div>
    )
}
