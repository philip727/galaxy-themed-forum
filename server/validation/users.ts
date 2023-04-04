import { SuccessResponse } from "../types/api"
import { validateAllFields, validateKeys } from "./api"

export const validateUsername = (username: string): [boolean, string] => {
    const regex = /^[a-zA-Z0-9]+$/ 
    if(!regex.test(username)) {
        return [false, "Username contains invalid characters"]
    }
    
    // The table only has a varchar of 16, so anything more will break it
    if (username.length >= 16) {
        return [false, "Username is too long"]
    }

    return [true, ""]
}

export const validatePassword = (password: string): [boolean, string] => {
    // Makes sure the password meets the critea of:
    // one uppercase character,
    // one common special character,
    // one number,
    // one lowercase character,
    // and is at least 8 characters
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    if(!regex.test(password)) {
        return [false, "This password does not meet the criteria"];
    }

    return [true, ""]
} 

export const validateEmail = (email: string): [boolean, string] => {
    // Makes sure the email is an actual valid email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(email)) {
        return [false, "Email is invalid"]
    }
    
    if (email.length >= 40) {
        return [false, "Email is too long"]
    }

    return [true, ""];
}

// Validates the register data
export const validateRegisterData = (data: any): SuccessResponse => {
    // Make sure the data is an object
    if (!data || !(typeof data == "object")) {
        return {
            success: false,
            response: "Failed to receive data from client, try refreshing",
        };
    };

    // Make sure the data contains all the required properties
    if (!validateKeys(data, ["username", "email", "password"])) {
        return {
            success: false,
            response: "Not received all properties in data, try refreshing",
        };
    }

    if (!validateAllFields(data)) {
        return {
            success: false,
            response: "Please fill in all required fields",
        };
    }

    // Makes sure the username is ok
    const [validUsername, usernameMessage] = validateUsername(data.username)
    if (!validUsername) {
        return {
            success: false,
            response: usernameMessage,
        };
    }

    // Makes sure the password is ok and meets the criteria
    const [validPassword, passwordMessage] = validatePassword(data.password);
    if (!validPassword) {
        return {
            success: false,
            response: passwordMessage
        };
    }
   
    // Makes sure the email is ok
    const [validEmail, emailMessage] = validateEmail(data.email);
    if (!validEmail) {
        return {
            success: false,
            response: emailMessage,
        }
    }

    return {
        success: true,
        response: data,
    };
}

export const validateLoginData = (data: any): SuccessResponse => { // Make sure the data is an object 
    if (!data || !(typeof data == "object")) {
        return {
            success: false,
            response: "Failed to receive data from client, try refreshing",
        };
    }

    // Make sure the data contains all the required properties
    if (!validateKeys(data, ["username", "password"])) {
        return {
            success: false,
            response: "Not received all properties in data, try refreshing",
        }
    }

    if (!validateAllFields(data)) {
        return {
            success: false,
            response: "Please fill in all required fields",
        };
    }
    
    return {
        success: true,
        response: data,
    }
}

