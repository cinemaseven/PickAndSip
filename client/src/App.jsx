import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router"
import AppLayout from "./components/organisms/AppLayout"
import DashboardPage from "./pages/DashboardPage"
import MyCafesPage from "./pages/MyCafesPage"
import CafeDetailsPage from "./pages/CafeDetailsPage"
import AddCafePage from "./pages/AddCafePage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from "./pages/LoginPage"

export default function App() {
  const [authenticated, setAuthenticated] = useState(
    () => Boolean(sessionStorage.getItem("pick-and-sip-auth"))
  )

  useEffect(() => {
    const handleAuthExpired = () => setAuthenticated(false)

    window.addEventListener("pick-and-sip-auth-expired", handleAuthExpired)

    return () => {
      window.removeEventListener("pick-and-sip-auth-expired", handleAuthExpired)
    }
  }, [])

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />
  }

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cafes" element={<MyCafesPage />} />
          <Route path="/cafes/:id" element={<CafeDetailsPage />} />
          <Route path="/add" element={<AddCafePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}