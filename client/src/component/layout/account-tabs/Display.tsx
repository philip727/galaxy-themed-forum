import axios from "axios";
import { ChangeEvent } from "react"

export default function Display() {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!e.target || !e.target.files) {
            return;
        }


        let formData = new FormData();
        formData.append('avatar', e.target.files[0]);

        axios.request({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            url: "/api/account/uploadpfp",
            data: formData,
        })
    }


    return (
        <div>
            <input onChange={handleChange} type="file" name="avatar" />
        </div>
    )
}
