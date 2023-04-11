import { AxiosResponse } from 'axios'
import { motion } from 'framer-motion';
import { ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../scripts/api/users';
import { isRegisterDataValid } from '../../scripts/auth/register';
import { createModal, destroyModal } from '../../scripts/layout/modalManager';
import { createNotification } from '../../scripts/layout/notificationManager';
import handlePromise from '../../scripts/promiseHandler';
import { IDetailsToRegister } from '../../types/user';
import InputField from '../inputs/InputField';
import ShineButton from '../inputs/ShineButton';

// For initial fade in
const animationVariants = {
    hide: {
        opacity: 0,
    },
    show: {
        opacity: 1,
    }
}

export default function Register() {
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
        const [err, res] = await handlePromise<AxiosResponse<any, any>>(createUser(registerData.current));
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
                <div className="container w-[30rem]">
                    <div className="w-full h-full flex flex-col justify-center gap-8 items-center p-8">
                        <InputField onChange={handleChange} type="text" name="username" placeholder="Username" />
                        <InputField onChange={handleChange} type="email" name="email" placeholder="Email" />
                        <InputField onChange={handleChange} type="password" name="password" placeholder="Password" />
                        <InputField onChange={handleChange} type="password" name="confirmPassword" placeholder="Confirm Password" />
                        <ShineButton onClick={() => { register() }}>
                            <p>Create Account</p>
                        </ShineButton>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

