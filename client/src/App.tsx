import { useState } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import RootLayout from './component/layout/RootLayout';
import Home from './component/pages/Home';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import { LoginDetails } from './types/user';
import './App.scss'


function App() {
    const [user, setUser] = useState<LoginDetails>({
        username: "",
        uid: -1,
        isLoggedIn: false,
    })

    return (
        <RouterProvider router={
            createBrowserRouter(
                createRoutesFromElements(
                    <Route path="/" element={<RootLayout userDetails={user} />}>
                        <Route index element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Route>
                )
            )}
        />
    );
}

export default App;
