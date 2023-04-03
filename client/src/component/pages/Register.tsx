import axios from 'axios'
import { API_URL } from '../../scripts/config'

export default function Register() {
    const register = () => {
        axios.request({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            url: `${API_URL}/api/user/register`,
            data: { username: "joe", email: "joe@gmail.com", password: "Philip@251102#" },
        })
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    }

    return (
        <div onClick={register}>Register</div>
    ); 
}
