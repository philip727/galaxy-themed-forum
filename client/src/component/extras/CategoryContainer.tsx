import './CategoryContainer.scss'

type Props = {
    name: string,
    description: string,
}

export default function CategoryContainer({ name, description }: Props) {
    return (
        <div className="container w-[30rem] category">
            <div className="flex flex-col justify-start items-center pb-1">
                <span className="w-full h-[2px] bg-[var(--blue-violet)]" />
                <div className="flex flex-row justify-start items-center w-full pl-2 mt-1">
                    <img className="h-14 w-14" src="images/speech-bubble-white.svg" />
                    <div className="w-full ml-1">
                        <h1 className="ml-2 font-medium text-2xl">{name}</h1>
                        <p className="ml-2 font-light text-lg">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
