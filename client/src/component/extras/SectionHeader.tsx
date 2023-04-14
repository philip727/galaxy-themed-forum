type Props = {
    className?: string,
    headerText: string,
}

export default function SectionHeader({ className, headerText }: Props) {
    return (
        <div className={`container ${className}`}>
            <div className="flex flex-col justify-start items-start pb-1">
                <span className="w-full h-[2px] bg-[var(--blue-violet)]" />
                <p className="mt-1 text-2xl font-bold ml-2">{headerText}</p>
            </div>
        </div>
    )
}
