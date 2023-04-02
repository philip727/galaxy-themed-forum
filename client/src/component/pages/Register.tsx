import axios from 'axios'

export default function Register() {

    const register = () => {
        axios.request({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "x-www-form-urlencoded",
            },
            url: `/api/user/register`,
            data: { username: "hello" },
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));

    }

    return (
        <div onClick={register}>Register</div>
    )
}
