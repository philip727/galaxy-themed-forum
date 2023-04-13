import { Link } from "react-router-dom"
import CategoryContainer from "../../extras/CategoryContainer"
import SectionHeader from "../../extras/SectionHeader"
import './Categories.scss'

type Props = {
    categories: any,
}

export default function Categories({ categories }: Props) {
    return (
        <div className="flex flex-col justify-start items-center gap-6">
            <SectionHeader widthClass="w-[30rem]" headerText="General" />
            {categories.success && (
                <>
                    {categories.response.map((category: any, index: any) => (
                        <Link key={index} to={`/category/${category.CID}`}>
                            <CategoryContainer name={category.name} description={category.description} categoryId={category.CID} />
                        </Link>
                    ))}
                </>
            )}
        </div>
    )
}
