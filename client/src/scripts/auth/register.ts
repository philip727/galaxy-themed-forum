import { IDetailsToRegister } from "../../types/user";

export const isRegisterDataValid = (regData: IDetailsToRegister): [boolean, string] => {
    for (const [_, entry] of Object.entries(regData)) {
        if (entry.length === 0) return [false, "Please fill in all required fields"];
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
    regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-=?<>[\]{}|\\\/]).{8,}$/;
    if (!regex.test(regData.password)) {
        return [false, "This password does not meet the criteria"];
    }

    // Well if the first password meets the criteria but the second one doesn't, clearly they do not match
    if (regData.confirmPassword !== regData.password || !regex.test(regData.confirmPassword)) {
        return [false, "The passwords do not match"];
    }

    return [true, ""];
}

