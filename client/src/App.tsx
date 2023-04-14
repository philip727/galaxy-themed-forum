import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './App.scss'
import RootLayout from './component/layout/RootLayout';
import Home, { homeLoader } from './component/pages/Home';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import Category, { categoryLoader } from './component/pages/Category';
import { PrivateWrapper, UnAuthorizedWrapper } from './component/Wrappers';
import Profile, { profileLoader } from './component/pages/Profile';
import MyAccount from './component/pages/MyAccount';
import Post from './component/pages/Post';

function App() {
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
                            <Route path=":id" element={<Category />} loader={categoryLoader}>
                            </Route>
                        </Route>

                        <Route path="/post">
                            <Route path=":id" element={<Post />} />
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
