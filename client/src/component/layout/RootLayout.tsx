import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function RootLayout() {
    return (
        <div>
            <div id="modal-holder" className="absolute w-full h-screen hidden justify-center items-center bg-[#0000007e] z-[9999]" />
            <div
                id="notification-holder"
                className="absolute top-28 left-[calc(50%-16rem)] h-20 flex flex-col justify-start items-center gap-6 bg-[#00000000] z-[9999]"
            />
            <header>
                <Navbar />
            </header>
            <main className="pt-24">
                <Outlet />
            </main>
        </div>
    )
}
