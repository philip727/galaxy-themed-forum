import axios from 'axios'
import jwtDecode from 'jwt-decode';
import { ChangeEvent, useRef } from "react";
import { API_URL } from '../../scripts/config';
import { LoginData } from "../../types/user";
import InputField from "../extras/InputField"
import ShineButton from "../extras/ShineButton"

export default function Login() {
    const loginData = useRef<LoginData>({
        username: "",
        password: "",
    });

    const login = () => {
        axios.request({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            url: `${API_URL}/api/user/login`,
            data: {
                username: loginData.current.username,
                password: loginData.current.password,
            },
        })
            .then(res => {
                if(!res.data.success) {
                    console.log(res.data.response);
                }
                
                localStorage.setItem("login-token", res.data.response);

                const decoded = jwtDecode(res.data.response);

                console.log(decoded);
            })
            .catch(err => console.log(err));
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        loginData.current = { ...loginData.current, [event.target.name]: event.target.value };
    }

    return (
        <div className="flex justify-center mt-32">
            <form className="bg-[var(--jet)] w-[30rem] flex flex-col items-center p-8 gap-8 deep-shadow">
                <InputField onChange={handleChange} type="text" name="username" placeholder="Username" />
                <InputField onChange={handleChange} type="password" name="password" placeholder="Password" />
                <ShineButton onClick={() => { login() }}>
                    <p>Login</p>
                </ShineButton>
            </form>
        </div>
    )
}
