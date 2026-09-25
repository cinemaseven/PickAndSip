import NavBar from "./NavBar"
import Footer from "./Footer"

export default function AppLayout({ children }) {
    return (
        <div className="app" id="top">
            <NavBar />
            <main> {children} </main>
            <Footer />
        </div>
    )
}