import { useEffect } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './App.scss'
import { LOGIN_TOKEN_NAME } from './scripts/config';
import { jwtLogin } from './scripts/auth/login';
import RootLayout from './component/layout/RootLayout';
import Home, { homeLoader } from './component/pages/Home';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import Category from './component/pages/Category';
import { useDispatch, useSelector } from 'react-redux';
import { PrivateWrapper, UnAuthorizedWrapper } from './component/Wrappers';
import socketIOClient from 'socket.io-client'
import { RootState } from './store';
import Profile, { profileLoader } from './component/pages/Profile';
import MyAccount from './component/pages/MyAccount';
import { updateCacheFromUser } from './scripts/utils/cache';

function App() {
    const user = useSelector((state: RootState) => state.user.value)
    const dispatch = useDispatch();

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

        // Locally stores the pfp destination of our user so we don't need to request everywhere we see it 
        updateCacheFromUser(user.uid);

        // Updates the user online status when logged in
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

                        <Route element={<UnAuthorizedWrapper />} >
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
                            <Route path="/account" element={<MyAccount />} />
                        </Route>
                    </Route>
                )
            )}
        />
    );
}

export default App;
