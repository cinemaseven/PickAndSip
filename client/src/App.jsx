import { BrowserRouter, Routes, Route } from "react-router"
import AppLayout from "./components/organisms/AppLayout"
import DashboardPage from "./pages/DashboardPage"
import MyCafesPage from "./pages/MyCafesPage"
import CafeDetailsPage from "./pages/CafeDetailsPage"
import AddCafePage from "./pages/AddCafePage"
import ProfilePage from "./pages/ProfilePage"

export default function App() {
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