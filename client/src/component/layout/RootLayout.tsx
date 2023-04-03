import { Outlet } from 'react-router-dom'
import { LoginDetails } from '../../types/user'
import Navbar from './Navbar'

type Props = {
    userDetails: LoginDetails,
}

export default function RootLayout({ userDetails }: Props) {
    return (
        <div>
            <header>
                <Navbar userDetails={userDetails} />
            </header>
            <main className="pt-24">
                <Outlet />
            </main>
        </div>
    )
}
