import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function LoginScreen() {
  const [mode, setMode] = useState('login') // login | register
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  async function loginWithGoogle() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    })
    if (error) { setError('Erro ao entrar com o Google.'); setLoading(false) }
  }

  async function handleEmailAuth() {
    if (!email || !password) { setError('Preenche o email e a password.'); return }
    if (password.length < 6) { setError('A password tem de ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    setError(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError('Email ou password incorretos.'); setLoading(false) }
      else navigate('/')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError('Erro ao criar conta. Tenta novamente.'); setLoading(false) }
      else { setSuccess('Conta criada! Verifica o teu email para confirmar.'); setLoading(false) }
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <div style={s.leaf}>🍃</div>
        <h1 style={s.title}>Leafdrop</h1>
        <p style={s.subtitle}>
          {mode === 'login' ? 'Entra na tua conta' : 'Cria uma conta nova'}
        </p>

        {/* Google */}
        <button style={s.googleBtn} onClick={loginWithGoogle} disabled={loading}>
          <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="Google" />
          Continuar com o Google
        </button>

        <div style={s.divider}><span style={s.dividerText}>ou com email</span></div>

        {/* Email/password */}
        <input
          style={s.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(null) }}
        />
        <input
          style={s.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(null) }}
        />

        {error && <p style={s.error}>{error}</p>}
        {success && <p style={s.successMsg}>{success}</p>}

        <button
          style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
          onClick={handleEmailAuth}
          disabled={loading}
        >
          {loading ? 'A processar...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <p style={s.switchMode}>
          {mode === 'login' ? 'Ainda não tens conta? ' : 'Já tens conta? '}
          <span style={s.switchLink} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setSuccess(null) }}>
            {mode === 'login' ? 'Criar conta' : 'Entrar'}
          </span>
        </p>

        <p style={s.skip}>
          <a href="/" style={s.skipLink}>Usar sem conta</a>
        </p>
      </div>
    </div>
  )
}

const s = {
  leaf: { fontSize: 32, marginBottom: 12, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.5px', textAlign: 'center' },
  subtitle: { fontSize: 14, color: 'var(--text2)', marginBottom: 24, textAlign: 'center' },
  googleBtn: { width: '100%', padding: '13px', background: 'var(--bg)', color: 'var(--text)', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 },
  divider: { display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 16px' },
  dividerText: { fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap', flex: 1, textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 },
  input: { width: '100%', padding: '12px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text)', outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  error: { fontSize: 13, color: '#e05252', marginBottom: 10, textAlign: 'center' },
  successMsg: { fontSize: 13, color: 'var(--accent)', marginBottom: 10, textAlign: 'center', lineHeight: 1.5 },
  btn: { width: '100%', padding: '14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 16 },
  btnDisabled: { opacity: 0.35, cursor: 'not-allowed' },
  switchMode: { fontSize: 13, color: 'var(--text3)', textAlign: 'center', marginBottom: 8 },
  switchLink: { color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 },
  skip: { fontSize: 13, color: 'var(--text3)', textAlign: 'center' },
  skipLink: { color: 'var(--text3)', textDecoration: 'none' },
}