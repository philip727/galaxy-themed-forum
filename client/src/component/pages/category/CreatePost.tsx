import { useRef } from "react";
import InputArea from "../../inputs/InputArea";
import InputField from "../../inputs/InputField";

export default function CreatePost() {
    const postInfo = useRef({
        title: "",
        content: "",
    })


    return (
        <div className="container w-[40rem] px-6 pt-2 pb-4">
            <p className="text-xl font-bold mb-2">Create a post</p>
            <InputField name="title" className="w-full" placeholder="Post title" />
            <InputArea
                name="content"
                maxLength={120}
                placeholder="Add comment..."
                className="mt-4 w-full !h-24 min-h-[5rem] mb-3"
                areaClassName="!px-4 pt-2"
            />
        </div>
    )
}
