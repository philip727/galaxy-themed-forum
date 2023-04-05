import axios from 'axios'
import { ChangeEvent, useRef } from "react";
import { isLoginDataValid, updateAuthItemsWithJWTCookie } from '../../scripts/auth/login';
import { API_URL } from '../../scripts/config';
import { IDetailsToLogin } from "../../types/user";
import InputField from "../extras/InputField"
import ShineButton from "../extras/ShineButton"
import jwtDecode from 'jwt-decode'
import { IJWTInfo } from '../../types/auth';
import { createModal, destroyModal } from '../../scripts/layout/modalManager';
import { createNotification } from '../../scripts/layout/notificationManager';
import Container from '../layout/blocks/Container';
import { motion } from 'framer-motion';

type Props = {
    setUser: (i: IJWTInfo) => void;
}

const animationVariants = {
    hide: {
        opacity: 0,
    },
    show: {
        opacity: 1,
    },
}

export default function Login({ setUser }: Props) {
    const loginData = useRef<IDetailsToLogin>({
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
        // Client side checks
        const [isValidData, validMessage] = isLoginDataValid(loginData.current);

        // If the data is not valid to make a request, then we error.
        // Everything is also checked on serverside anyway.
        if (!isValidData) {
            createNotification({
                text: validMessage,
            });
            return;
        }

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
                        subtext: data.response,
                        buttons: [
                            {
                                text: "Ok",
                                fn: destroyModal,
                            }
                        ]
                    })
                }

                jwtLogin(data.response);
            })
            .catch(err => console.log(err));
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        loginData.current = { ...loginData.current, [event.target.name]: event.target.value };
    }

    return (
        <motion.div
            variants={animationVariants}
            initial="hide"
            animate="show"
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-center items-center mt-20"
        >
            <h1 className="text-5xl font-extrabold">Login</h1>
            <div
                className="flex justify-center mt-12"
            >
                <Container>
                    <div className="w-full h-full flex flex-col justify-center gap-8 items-center p-8">
                        <InputField onChange={handleChange} type="text" name="username" placeholder="Username" />
                        <InputField onChange={handleChange} type="password" name="password" placeholder="Password" />
                        <ShineButton onClick={() => { login() }}>
                            <p>Login</p>
                        </ShineButton>
                    </div>
                </Container>
            </div>
        </motion.div>
    )
}
