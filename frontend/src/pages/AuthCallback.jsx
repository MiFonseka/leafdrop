import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/')
      } else {
        navigate('/login')
      }
    })
  }, [])

  return (
    <div className="page-center">
      <p style={{ color: 'var(--text3)' }}>A entrar...</p>
    </div>
  )
}