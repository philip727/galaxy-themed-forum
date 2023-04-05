import { useEffect, useState } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import RootLayout from './component/layout/RootLayout';
import Home from './component/pages/Home/Home';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import './App.scss'
import { IJWTInfo } from './types/auth';
import { LOGIN_COOKIE_NAME } from './scripts/config';
import { deleteJWTCookie, updateAuthItemsWithJWTCookie } from './scripts/auth/login';
import jwtDecode from 'jwt-decode';
import { setAuthTokenHeader } from './scripts/auth/headers';
import { createNotification } from './scripts/layout/notificationManager';
import { createModal } from './scripts/layout/modalManager';
import { ModalFunctionTypes } from './types/layout';


function App() {
    const [user, setUser] = useState<IJWTInfo>({
        username: "",
        uid: -1,
        iat: 0,
        exp: 0,
    })

    const updateUser = (userDetails: IJWTInfo) => {
        setUser(userDetails);
    }

    const clearUser = () => {
        setUser({
            username: "",
            uid: -1,
            iat: 0,
            exp: 0,
        })
        setAuthTokenHeader();
        deleteJWTCookie();
    }

    // Logs in with the jwt
    const jwtLogin = (jwt: string) => {
        // Verifies the jwt with the server
        updateAuthItemsWithJWTCookie(jwt)
            .then(data => {
                const [success, jwt] = data;
                if (!success) {
                    return;
                }

                // Decodes the jwt to use the information
                const userDetails = jwtDecode(jwt) as IJWTInfo;

                // If it's been X time then delete the cookie
                const currentTime = Date.now() / 1000;
                if (userDetails.exp < currentTime) {
                    deleteJWTCookie();
                    return;
                }

                updateUser(userDetails);
            })
            .catch(err => {
                createModal({
                    header: "Session Verification",
                    subtext: err,
                    buttons: [{
                        text: "Ok",
                        fn: ModalFunctionTypes.CLOSE
                    }]
                })
            })
    }


    useEffect(() => {
        // Ensures the jwt cookie is valid
        if (!localStorage[LOGIN_COOKIE_NAME]) {
            return;
        }

        const token = localStorage[LOGIN_COOKIE_NAME];

        jwtLogin(token);
    }, [])

    return (
        <RouterProvider router={
            createBrowserRouter(
                createRoutesFromElements(
                    <Route path="/" element={<RootLayout userDetails={user} clearUser={clearUser} />}>
                        <Route index element={<Home />} />
                        <Route path="/register" element={<Register userDetails={user} />} />
                        <Route path="/login" element={<Login setUser={updateUser} userDetails={user} />} />
                    </Route>
                )
            )}
        />
    );
}

export default App;
