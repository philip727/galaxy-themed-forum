import axios, { AxiosResponse } from 'axios'
import { ChangeEvent, useEffect, useRef } from "react";
import { isLoginDataValid, updateAuthItemsWithJWTToken } from '../../scripts/auth/login';
import { IDetailsToLogin } from "../../types/user";
import InputField from "../extras/InputField"
import ShineButton from "../extras/ShineButton"
import jwtDecode from 'jwt-decode'
import { IJWTInfo } from '../../types/auth';
import { createModal } from '../../scripts/layout/modalManager';
import { createNotification } from '../../scripts/layout/notificationManager';
import Container from '../layout/blocks/Container';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ModalFunctionTypes } from '../../types/layout';
import handlePromise from '../../scripts/promiseHandler';

type Props = {
    setUser: (i: IJWTInfo) => void,
    userDetails: IJWTInfo,
}

const animationVariants = {
    hide: {
        opacity: 0,
    },
    show: {
        opacity: 1,
    },
}

export default function Login({ setUser, userDetails }: Props) {
    const navigate = useNavigate();
    const loginData = useRef<IDetailsToLogin>({
        username: "",
        password: "",
    });

    // Logs in with the jwt token
    const jwtLogin = async (jwt: string) => {
        // Verifies the jwt with the server
        const [err, res] = await handlePromise<string>(updateAuthItemsWithJWTToken(jwt, true));
        if (err) {
            // Creates a prompt with the error message
            createModal({
                header: "Login",
                subtext: err,
                buttons: [
                    {
                        text: "Ok",
                        fn: ModalFunctionTypes.CLOSE,
                    }
                ]
            })
            return;
        }

        const userDetails = jwtDecode(res as string) as IJWTInfo;

        setUser(userDetails);
    }

    const login = async () => {
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

        // Requests to login with the login data, will return a jwt so we can login on the client
        const [err, res] = await handlePromise<AxiosResponse<any, any>>(loginRequest(loginData.current.username, loginData.current.password));
        if (err) {
            console.log(err);
            return;
        }
        
        const data = res?.data;

        if (!data.success) {
            // Creates a prompt if with the error message
            createModal({
                header: "Login",
                subtext: data.response,
                buttons: [
                    {
                        text: "Ok",
                        fn: ModalFunctionTypes.CLOSE,
                    }
                ]
            })
            return;
        }

        jwtLogin(data.response);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        loginData.current = { ...loginData.current, [event.target.name]: event.target.value };
    }

    // Makes sure the user goes back to home page if already logged in
    useEffect(() => {
        if (userDetails.username.length > 0 && userDetails.uid > 0) {
            navigate("/");
        }
    }, [userDetails])

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

const loginRequest = (username: string, password: string) => {
    return axios.request({
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/api/user/login",
        data: {
            username: username,
            password: password,
        },
    })

}
