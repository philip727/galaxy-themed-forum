export const randomChar = (): string => {
    var CHAR_SET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_?=-"; // define a set of characters to choose from
    var randomIndex = Math.floor(Math.random() * CHAR_SET.length); // generate a random index within the character set
    return CHAR_SET[randomIndex]; // return the character at the random index
}


export const generateRandomString = (length: number=32): string => {
    let string = ""
    for (let i = 0; i < length; i++) {
        string += randomChar(); 
    } 

    return string
}
