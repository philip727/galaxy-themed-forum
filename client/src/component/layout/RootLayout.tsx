import { Outlet } from 'react-router-dom'
import { IJWTInfo } from '../../types/auth'
import { LoginDetails } from '../../types/user'
import Navbar from './Navbar'

type Props = {
    userDetails: IJWTInfo,
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
