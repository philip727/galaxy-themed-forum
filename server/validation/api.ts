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
