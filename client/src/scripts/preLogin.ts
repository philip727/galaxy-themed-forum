import { jwtLogin } from "./auth/login";
import { LOGIN_TOKEN_NAME } from "./config";

export default function() {
    // Ensures the localstorage has a login token
    if (!localStorage[LOGIN_TOKEN_NAME]) {
        return;
    }

    const token = localStorage[LOGIN_TOKEN_NAME];

    jwtLogin(token);
}
