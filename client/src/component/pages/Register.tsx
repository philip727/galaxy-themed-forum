import axios from 'axios'
import { ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isRegisterDataValid } from '../../scripts/auth/register';
import { API_URL } from '../../scripts/config'
import { createModal, destroyModal } from '../../scripts/layout/modalManager';
import { createNotification } from '../../scripts/layout/notificationManager';
import { IDetailsToRegister } from '../../types/user';
import InputField from '../extras/InputField';
import ShineButton from '../extras/ShineButton';


export default function Register() {
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

    return (
        <div className="flex justify-center mt-32">
            <form className="bg-[var(--jet)] w-[30rem] flex flex-col items-center p-8 gap-8 deep-shadow">
                <InputField onChange={handleChange} type="text" name="username" placeholder="Username" />
                <InputField onChange={handleChange} type="email" name="email" placeholder="Email" />
                <InputField onChange={handleChange} type="password" name="password" placeholder="Password" />
                <InputField onChange={handleChange} type="password" name="confirmPassword" placeholder="Confirm Password" />
                <ShineButton onClick={() => { register() }}>
                    <p>Create Account</p>
                </ShineButton>
            </form>
        </div>
    );
}
