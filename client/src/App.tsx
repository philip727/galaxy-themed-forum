import { useEffect } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './App.scss'
import { IJWTInfo } from './types/auth';
import { LOGIN_TOKEN_NAME } from './scripts/config';
import { deleteJWTCookie, updateAuthWithJWTToken } from './scripts/auth/login';
import jwtDecode from 'jwt-decode';
import RootLayout from './component/layout/RootLayout';
import Home, { homeLoader } from './component/pages/Home';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import { createModal } from './scripts/layout/modalManager';
import { ModalFunctionTypes } from './types/layout';
import handlePromise from './scripts/promiseHandler';
import Category from './component/pages/Category';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './reducers/user';
import { PrivateWrapper, UnauthorizedWrapper } from './component/Wrappers';
import socketIOClient from 'socket.io-client'
import { RootState } from './store';
import Profile, { profileLoader } from './component/pages/Profile';

function App() {
    const user = useSelector((state: RootState) => state.user.value)
    const dispatch = useDispatch();

    // Logs in with the jwt
    const jwtLogin = async (jwt: string) => {
        // Verifies the jwt with the server
        const [err, res] = await handlePromise<string>(updateAuthWithJWTToken(jwt));
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
            });
            return;
        }

        const userDetails = jwtDecode(res as string) as IJWTInfo;

        // If it's been X time then delete the cookie
        const currentTime = Date.now() / 1000;
        if (userDetails.exp < currentTime) {
            deleteJWTCookie();
            return;
        }

        dispatch(updateUser({ username: userDetails.username, uid: userDetails.uid }));
    }

    useEffect(() => {
        // Ensures the localstorage has a login token
        if (!localStorage[LOGIN_TOKEN_NAME]) {
            return;
        }

        const token = localStorage[LOGIN_TOKEN_NAME];

        jwtLogin(token);
    }, [])

    useEffect(() => {
        if (user.uid < 0 || user.username.length == 0 || !localStorage[LOGIN_TOKEN_NAME]) {
            return;
        }
        const socket = socketIOClient("http://localhost:3100", { reconnectionAttempts: 5 });
        
        socket.on('connect', () => {
            socket.emit('online', localStorage[LOGIN_TOKEN_NAME]); 
        })

    }, [user])

    return (
        <RouterProvider router={
            createBrowserRouter(
                createRoutesFromElements(
                    <Route path="/" element={<RootLayout />}>
                        <Route index element={<Home />} loader={homeLoader} />

                        <Route element={<UnauthorizedWrapper />} >
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                        </Route>

                        <Route path="/category">
                            <Route path=":id" element={<Category />} />
                        </Route>

                        <Route path="/profile">
                            <Route path=":id" element={<Profile />} loader={profileLoader} />
                        </Route>

                        <Route element={<PrivateWrapper />}>
                            <Route path="/account" />
                        </Route>
                    </Route>
                )
            )}
        />
    );
}

export default App;
