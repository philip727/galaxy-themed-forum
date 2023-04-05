import axios from 'axios'
import { motion } from 'framer-motion';
import { ChangeEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isRegisterDataValid } from '../../scripts/auth/register';
import { API_URL } from '../../scripts/config'
import { createModal, destroyModal } from '../../scripts/layout/modalManager';
import { createNotification } from '../../scripts/layout/notificationManager';
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

    const register = () => {
        // Client side checks
        const [isValidData, validMessage] = isRegisterDataValid(registerData.current);

        // If the data is not valid to make a request, then we error.
        // Everything is also checked on serverside anyway.
        if (!isValidData) {
            createNotification({
                text: validMessage,
            });
            return;
        }

        // Post to register
        axios.request({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            url: `${API_URL}/api/user/register`,
            data: {
                username: registerData.current.username,
                email: registerData.current.email,
                password: registerData.current.password,
            },
        })
            .then(res => {
                const data = res.data;
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
            })
            .catch(_ => {
                // Server error prompt if it can't make the request
                createModal({
                    header: "Register",
                    subtext: "Server Error (R-01)",
                    buttons: [{
                        text: "Ok",
                        fn: destroyModal,
                    }]
                });
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
            <div className="flex justify-center gap-7 mt-12">
                <div className="w-[30rem]" />
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
                <div className="flex flex-col justify-start items-center gap-8">
                    <Container key={1}>
                        <div className="w-full h-full flex flex-col justify-start items-start py-3 px-4">
                            <h1 className="font-semibold text-3xl">Username</h1>
                            <ul>
                                <li>Your username must be unique</li>
                                <li>Your username must be less than 16 characters long</li>
                            </ul>
                        </div>
                    </Container>
                    <Container key={2}>
                        <div className="w-full h-full flex flex-col justify-start items-start py-3 px-4">
                            <h1 className="font-semibold text-3xl">Email</h1>
                            <ul>
                                <li>Your email must be unique</li>
                                <li>Your email must be less than 40 characters long</li>
                            </ul>
                        </div>
                    </Container>
                    <Container key={3}>
                        <div className="w-full h-full flex flex-col justify-start items-start py-3 px-4">
                            <h1 className="font-semibold text-3xl">Password</h1>
                            <p className="text-base text-[var(--warning-red)] font-bold">Please make sure you keep your password secure. If you will struggle to remember it, write it down.</p>
                            <ul>
                                <li>Your password must be at least 8 characters long</li>
                                <li>Your password must contain one uppercase character</li>
                                <li>Your password must contain one lowercase character</li>
                                <li>Your password must contain one special character</li>
                            </ul>
                        </div>
                    </Container>
                </div>
            </div>
        </motion.div>
    );
}
