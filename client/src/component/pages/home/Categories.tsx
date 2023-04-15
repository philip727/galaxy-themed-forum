import { Link } from "react-router-dom"
import { CategoryInfo } from "../../../types/category"
import { ServerResponse } from "../../../types/response"
import CategoryContainer from "../../extras/CategoryContainer"
import SectionHeader from "../../extras/SectionHeader"
import './Categories.scss'

type Props = {
    categories: ServerResponse<CategoryInfo[]>,
}

export default function Categories({ categories }: Props) {
    return (
        <div className="flex flex-col justify-start items-center gap-6">
            <SectionHeader className="w-[30rem]" headerText="General" />
            {categories.success && (
                <>
                    {categories.response.map((category: any, index: any) => (
                        <Link key={index} to={`/category/${category.id}`}>
                            <CategoryContainer name={category.name} description={category.description} />
                        </Link>
                    ))}
                </>
            )}
        </div>
    )
}
