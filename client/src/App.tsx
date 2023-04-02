import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import RootLayout from './component/layout/RootLayout';
import Home from './component/pages/Home';
import Login from './component/pages/Login';
import Register from './component/pages/Register';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Route>
    )
);


function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
