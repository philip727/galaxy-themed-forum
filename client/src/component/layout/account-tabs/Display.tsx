import axios from "axios";
import { ChangeEvent } from "react"

export default function Display() {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!e.target || !e.target.value) {
            return;
        }

        let formData = new FormData();
        formData.append('avatar', e.target.value);

        axios.request({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data",
            },
            url: "/api/user/uploadpfp",
            data: formData,
        })
    }


    return (
        <div>
            <input onChange={handleChange} type="file" name="avatar" />
        </div>
    )
}
