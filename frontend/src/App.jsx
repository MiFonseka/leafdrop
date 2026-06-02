import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase.js'
import HomeScreen from './pages/HomeScreen.jsx'
import KoboScreen from './pages/KoboScreen.jsx'
import UploadScreen from './pages/UploadScreen.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import ProfileScreen from './pages/ProfileScreen.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import NotFoundScreen from './pages/NotFoundScreen.jsx'

export default function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
  // Processa o token do redirect do Google
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (user === undefined) return null // a carregar

  return (
    <Routes>
      <Route path="/" element={<HomeScreen user={user} />} />
      <Route path="/receive" element={<KoboScreen />} />
      <Route path="/upload/:code" element={<UploadScreen user={user} />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginScreen />} />
      <Route path="/profile" element={user ? <ProfileScreen /> : <Navigate to="/login" />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}