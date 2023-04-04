import axios from 'axios'
import { ChangeEvent, useRef } from "react";
import { updateAuthItemsWithJWTCookie } from '../../scripts/auth/login';
import { API_URL } from '../../scripts/config';
import { DetailsToLogin } from "../../types/user";
import InputField from "../extras/InputField"
import ShineButton from "../extras/ShineButton"
import jwtDecode from 'jwt-decode'
import { IJWTInfo } from '../../types/auth';
import { createModal, destroyModal } from '../../scripts/layout/modalManager';

type Props = {
    setUser: (i: IJWTInfo) => void;
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
                const [success, response] = data;
                if (!success) {
                    // Creates a prompt if with the error message
                    createModal({
                        header: "Login",
                        subtext: response,
                        buttons: [
                            {
                                text: "Ok",
                                fn: destroyModal,
                            }
                        ]
                    })
                    return;
                }

                const userdetails = jwtDecode(response) as IJWTInfo;

                setUser(userdetails);
            })
            .catch(err => {
                // Creates a prompt if with the error message
                createModal({
                    header: "Login",
                    subtext: err,
                    buttons: [
                        {
                            text: "Ok",
                            fn: destroyModal,
                        }
                    ]
                })
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
                const data = res.data;
                if (!res.data.success) {
                    // Creates a prompt if with the error message
                    createModal({
                        header: "Login",
                        subtext: res.data.response,
                        buttons: [
                            {
                                text: "Ok",
                                fn: destroyModal,
                            }
                        ]
                    })
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
