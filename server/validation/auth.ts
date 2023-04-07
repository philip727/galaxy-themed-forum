import { validateAllFields, validateKeys } from "./api"

// Verfies a JWT was actually passed
export const verifyReceivedJWT = (jwt: object): boolean => {
    if (!validateKeys(jwt, ["jwt"])) {
        return false;
    }

    if (!validateAllFields(jwt)) {
        return false;
    }

    return true;
}
