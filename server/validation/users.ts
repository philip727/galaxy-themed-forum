export const validateUsername = (username: string): [boolean, string] => {
    if (username.length == 0) {
        return [false, "Please fill in the username field"]
    }

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
    if (password.length == 0) {
        return [false, "Please fill in the password field"];
    }

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
    if (email.length == 0) {
        return [false, "Please fill in the email field"];
    }

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
