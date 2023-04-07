// React & Styling
import { useEffect, useState } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './App.scss'

// JWT & Authentication
import { IJWTInfo } from './types/auth';
import { LOGIN_COOKIE_TOKEN as LOGIN_TOKEN_NAME } from './scripts/config';
import { deleteJWTCookie, updateAuthItemsWithJWTToken as updateAuthItemsWithJWTToken } from './scripts/auth/login';
import jwtDecode from 'jwt-decode';
import { setAuthTokenHeader } from './scripts/auth/headers';

// Components
import RootLayout from './component/layout/RootLayout';
import Home from './component/pages/Home/Home';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import { createModal } from './scripts/layout/modalManager';
import { ModalFunctionTypes } from './types/layout';
import handlePromise from './scripts/promiseHandler';

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
    const jwtLogin = async (jwt: string) => {
        // Verifies the jwt with the server
        const [err, res] = await handlePromise<string>(updateAuthItemsWithJWTToken(jwt));
        if (err) {
            // Creates a prompt if with the error message
            createModal({
                header: "Login",
                subtext: err,
                buttons: [
                    {
                        text: "Ok",
                        fn: ModalFunctionTypes.CLOSE,
                    }
                ]
            })
            return;
        }

        const userDetails = jwtDecode(res as string) as IJWTInfo;

        // If it's been X time then delete the cookie
        const currentTime = Date.now() / 1000;
        if (userDetails.exp < currentTime) {
            deleteJWTCookie();
            return;
        }

        updateUser(userDetails);
    }

    useEffect(() => {
        // Ensures the localstorage has a login token
        if (!localStorage[LOGIN_TOKEN_NAME]) {
            return;
        }

        const token = localStorage[LOGIN_TOKEN_NAME];

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
