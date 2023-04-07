import axios, { AxiosResponse } from 'axios'
import { motion } from 'framer-motion';
import { ChangeEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isRegisterDataValid } from '../../scripts/auth/register';
import { createModal, destroyModal } from '../../scripts/layout/modalManager';
import { createNotification } from '../../scripts/layout/notificationManager';
import handlePromise from '../../scripts/promiseHandler';
import { IJWTInfo } from '../../types/auth';
import { IDetailsToRegister } from '../../types/user';
import InputField from '../extras/InputField';
import ShineButton from '../extras/ShineButton';
import Container from '../layout/blocks/Container';

// For initial fade in
const animationVariants = {
    hide: {
        opacity: 0,
    },
    show: {
        opacity: 1,
    }
}

type Props = {
    userDetails: IJWTInfo,
}


export default function Register({ userDetails }: Props) {
    const navigate = useNavigate();
    const registerData = useRef<IDetailsToRegister>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const register = async () => {
        // Client side checks
        const [isValidData, validMessage] = isRegisterDataValid(registerData.current);

        // Client side checks, checks on serverside anyway
        if (!isValidData) {
            createNotification({
                text: validMessage,
            });
            return;
        }

        // Post to register
        const [err, res] = await handlePromise<AxiosResponse<any, any>>(requestRegister(registerData.current));
        if (err) {
            // Server error prompt if it can't make the request
            createModal({
                header: "Register",
                subtext: "Server is unavailable (CR)",
                buttons: [{
                    text: "Ok",
                    fn: destroyModal,
                }]
            });
            return;
        }

        const data = res?.data;
        if (!data.success) {
            createNotification({
                text: data.response
            });
            return;
        }

        // Creates a prompt that will take the user to the login page
        createModal({
            header: "Register",
            subtext: `Welcome, ${registerData.current.username}! Enjoy your stay`,
            buttons: [{
                text: "Go Login!",
                fn: () => {
                    navigate("/login");
                    destroyModal();
                },
            }]
        });
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        registerData.current = { ...registerData.current, [event.target.name]: event.target.value };
    }

    // Makes sure the user goes back to home page if already logged in
    useEffect(() => {
        if (userDetails.username.length > 0 && userDetails.uid > 0) {
            navigate("/");
        }
    }, [userDetails])

    return (
        <motion.div
            className="flex flex-col justify-center items-center mt-20"
            variants={animationVariants}
            initial="hide"
            animate="show"
            transition={{ duration: 0.3 }}
        >
            <h1 className="text-5xl font-extrabold">Sign up</h1>
            <div className="gap-7 mt-12">
                <Container key={1}>
                    <div className="w-full h-full flex flex-col justify-center gap-8 items-center p-8">
                        <InputField onChange={handleChange} type="text" name="username" placeholder="Username" />
                        <InputField onChange={handleChange} type="email" name="email" placeholder="Email" />
                        <InputField onChange={handleChange} type="password" name="password" placeholder="Password" />
                        <InputField onChange={handleChange} type="password" name="confirmPassword" placeholder="Confirm Password" />
                        <ShineButton onClick={() => { register() }}>
                            <p>Create Account</p>
                        </ShineButton>
                    </div>
                </Container>
            </div>
        </motion.div>
    );
}

const requestRegister = (details: IDetailsToRegister) => {
    return axios.request({
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        url: "/api/user/register",
        data: {
            username: details.username,
            email: details.email,
            password: details.password,
        },
    })
}
