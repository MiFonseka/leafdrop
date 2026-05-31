import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function loginWithGoogle() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })
    if (error) {
      setError('Erro ao entrar com o Google. Tenta novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <div style={s.leaf}>🍃</div>
        <h1 style={s.title}>Leafdrop</h1>
        <p style={s.subtitle}>Entra para guardar o teu histórico e dispositivos</p>

        <button
          style={{ ...s.googleBtn, ...(loading ? s.btnDisabled : {}) }}
          onClick={loginWithGoogle}
          disabled={loading}
        >
          <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="Google" />
          {loading ? 'A entrar...' : 'Continuar com o Google'}
        </button>

        {error && <p style={s.error}>{error}</p>}

        <p style={s.skip}>
          Preferes não criar conta?{' '}
          <a href="/" style={s.skipLink}>Usar sem conta</a>
        </p>
      </div>
    </div>
  )
}

const s = {
  leaf: { fontSize: 32, marginBottom: 12, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.5px', textAlign: 'center' },
  subtitle: { fontSize: 14, color: 'var(--text2)', marginBottom: 32, lineHeight: 1.5, textAlign: 'center' },
  googleBtn: { width: '100%', padding: '13px', background: 'var(--bg)', color: 'var(--text)', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 },
  btnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
  error: { fontSize: 13, color: '#e05252', textAlign: 'center', marginBottom: 12 },
  skip: { fontSize: 13, color: 'var(--text3)', textAlign: 'center' },
  skipLink: { color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 },
}