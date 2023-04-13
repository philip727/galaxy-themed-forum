import { jwtLogin } from "./scripts/auth/login";
import { LOGIN_TOKEN_NAME } from "./scripts/config";

export default function() {
    // Ensures the localstorage has a login token
    if (!localStorage[LOGIN_TOKEN_NAME]) {
        return;
    }

    const token = localStorage[LOGIN_TOKEN_NAME];

    jwtLogin(token);
}
