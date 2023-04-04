import { useEffect, useState } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import RootLayout from './component/layout/RootLayout';
import Home from './component/pages/Home';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import './App.scss'
import { IJWTInfo } from './types/auth';
import { LOGIN_COOKIE_NAME } from './scripts/config';
import { deleteJWTCookie, updateAuthItemsWithJWTCookie } from './scripts/auth/login';
import jwtDecode from 'jwt-decode';


function App() {
    const [user, setUser] = useState<IJWTInfo>({
        username: "",
        uid: -1,
        iat: 0,
        exp: 0,
    })

    const updateUser = (userJWT: IJWTInfo) => {         
        setUser(userJWT)
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

                const userdetails = jwtDecode(jwt) as IJWTInfo;
                
                // If it's been X time then delete the cookie
                const currentTime = Date.now() / 1000;
                if (userdetails.exp < currentTime) {
                    deleteJWTCookie();
                    return;
                }
                
                setUser(userdetails);
            })
            .catch(err => {
                console.log(err);
            })
    }


    useEffect(() => {
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
                    <Route path="/" element={<RootLayout userDetails={user} />}>
                        <Route index element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login setUser={updateUser} />} />
                    </Route>
                )
            )}
        />
    );
}

export default App;
