// Makes sure the response contains all of the required values
export const validateResponse = (response: object): boolean => {
    if (!response || !(typeof response == "object") || !("success" in response) || !("response" in response)) {
        return false;
    }

    return true;
}
