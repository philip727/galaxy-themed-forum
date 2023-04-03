import axios from 'axios'
import { ChangeEvent, useRef } from 'react';
import { API_URL } from '../../scripts/config'
import { RegisterData } from '../../types/register';


export default function Register() {
    const registerData = useRef<RegisterData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const isRegisterDataValid = (regData: RegisterData): [boolean, string] => {
        for (const field in regData) {
            if (field.length == 0) return [false, "Please fill in all fields"];
        }

        // Makes sure the username is valid
        let regex = /^[a-zA-Z0-9]+$/
        if (!regex.test(regData.username)) {
            return [false, "Username contains invalid characters"];
        }

        // The table only has a varchar of 16, so anything more will break it
        if (regData.username.length >= 16) {
            return [false, "Username is too long"];
        }

        // Makes sure the email is an actual valid email
        regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(regData.email)) {
            return [false, "Email is invalid"];
        }

        if (regData.email.length >= 40) {
            return [false, "Email is too long"];
        }

        // Makes sure the password meets the critea of:
        // one uppercase character,
        // one common special character,
        // one number,
        // one lowercase character,
        // and is at least 8 characters
        regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
        if (!regex.test(regData.password)) {
            return [false, "This password does not meet the criteria"];
        }

        // Well if the first password meets the criteria but the second one doesn't, clearly they do not match
        if (regData.confirmPassword !== regData.password || !regex.test(regData.confirmPassword)) {
            return [false, "The passwords do not match"];
        }

        return [true, ""];
    }

    const register = () => {
        const [isValidData, validMessage] = isRegisterDataValid(registerData.current); 
        
        if (!isValidData) {
            console.log(validMessage);
            return;
        }

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
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        registerData.current = { ...registerData.current, [event.target.name]: event.target.value };
    }

    return (
        <div>
            <form>
                <input onChange={handleChange} type="text" name="username" required />
                <input onChange={handleChange} type="email" name="email" required />
                <input onChange={handleChange} type="password" name="password" required />
                <input onChange={handleChange} type="password" name="confirmPassword" required />
            </form>
        </div>
    );
}
