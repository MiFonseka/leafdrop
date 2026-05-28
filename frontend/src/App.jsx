import { Routes, Route } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen.jsx'
import KoboScreen from './pages/KoboScreen.jsx'
import UploadScreen from './pages/UploadScreen.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/receive" element={<KoboScreen />} />
      <Route path="/upload/:code" element={<UploadScreen />} />
    </Routes>
  )
}