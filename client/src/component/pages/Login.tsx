import axios from 'axios'
import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import { updateAuthItemsWithJWTCookie } from '../../scripts/auth/login';
import { API_URL } from '../../scripts/config';
import { DetailsToLogin, LoginDetails } from "../../types/user";
import InputField from "../extras/InputField"
import ShineButton from "../extras/ShineButton"
import jwtDecode from 'jwt-decode'
import { IJWTInfo } from '../../types/auth';

type Props = {
    setUser: Dispatch<SetStateAction<IJWTInfo>> 
}

export default function Login({ setUser }: Props) {
    const loginData = useRef<DetailsToLogin>({
        username: "",
        password: "",
    });
    
    // Logs in with the jwt
    const jwtLogin = (jwt: string) => {
        // Verifies the jwt with the server
        updateAuthItemsWithJWTCookie(jwt, true)
            .then(data => {
                const [success, jwt] = data;   
                if (!success) {
                    return; 
                }

                const userdetails = jwtDecode(jwt);
                
                setUser(userdetails as IJWTInfo);
            })
    }

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
                if (!res.data.success) {
                    console.log(res.data.response);
                }
                
                jwtLogin(res.data.response);
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
