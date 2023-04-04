// Makes sure the response contains all of the required values
export const validateResponse = (response: object): boolean => {
    if (!response || !(typeof response == "object") || !("success" in response) || !("response" in response)) {
        return false;
    }

    return true;
}

export const validateKeys = (data: object, keys: string[]): boolean => {
    let isOk = true;
    keys.forEach(column => {
        if (!(column in data)) {
            isOk = false;
        }
    })

    return isOk;
}

export const validateAllFields = (data: object): boolean => {
    for (const [_, value] of Object.entries(data)) {
        if (value.length == 0) return false;
    }

    return true;
}
