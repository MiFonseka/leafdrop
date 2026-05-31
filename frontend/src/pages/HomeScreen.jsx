import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomeScreen({ user }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  function handleSubmit() {
    const clean = code.trim().toUpperCase()
    if (clean.length !== 6) {
      setError('O código tem de ter 6 caracteres')
      return
    }
    navigate(`/upload/${clean}`)
  }

  return (
    <div className="page-center">
      <div className="card">

        {/* Header com perfil */}
        <div style={s.topBar}>
          <span style={s.leaf}>🍃</span>
          {user ? (
            <button style={s.profileBtn} onClick={() => navigate('/profile')}>
              {user.user_metadata?.full_name?.split(' ')[0] || 'Perfil'} →
            </button>
          ) : (
            <button style={s.profileBtn} onClick={() => navigate('/login')}>
              Entrar
            </button>
          )}
        </div>

        <h1 style={s.title}>Leafdrop</h1>
        <p style={s.subtitle}>Introduz o código que aparece no teu Kobo</p>

        <div style={s.inputs}>
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              id={`char-${i}`}
              type="text"
              maxLength={1}
              value={code[i] || ''}
              style={{
                ...s.charInput,
                ...(code[i] ? s.charInputFilled : {}),
              }}
              onChange={e => {
                const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                const chars = code.split('')
                chars[i] = val
                setCode(chars.join(''))
                setError(null)
                if (val && i < 5) document.getElementById(`char-${i + 1}`)?.focus()
              }}
              onKeyDown={e => {
                if (e.key === 'Backspace' && !code[i] && i > 0) {
                  document.getElementById(`char-${i - 1}`)?.focus()
                }
              }}
            />
          ))}
        </div>

        {error && <p style={s.error}>{error}</p>}

        <button
          style={{ ...s.btn, ...(code.length < 6 ? s.btnDisabled : {}) }}
          onClick={handleSubmit}
          disabled={code.length < 6}
        >
          Continuar
        </button>

        <p style={s.hint}>
          Abre <strong>leafdrop-backend.onrender.com/api/session/kobo</strong> no browser do teu Kobo para obteres o código
        </p>
      </div>
    </div>
  )
}

const s = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  leaf: { fontSize: 24 },
  profileBtn: { background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: 'var(--text2)', cursor: 'pointer' },
  title: { fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.5px', textAlign: 'center' },
  subtitle: { fontSize: 14, color: 'var(--text2)', marginBottom: 36, lineHeight: 1.5, textAlign: 'center' },
  inputs: { display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 },
  charInput: { width: 46, height: 54, textAlign: 'center', fontSize: 22, fontWeight: 700, fontFamily: 'monospace', border: '1.5px solid var(--border)', borderRadius: 10, background: 'var(--bg)', color: 'var(--text)', outline: 'none', textTransform: 'uppercase', transition: 'border-color .15s' },
  charInputFilled: { borderColor: 'var(--accent)', background: 'var(--accent-bg)' },
  error: { fontSize: 13, color: '#e05252', marginBottom: 16, textAlign: 'center' },
  btn: { width: '100%', padding: '14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 24, transition: 'opacity .15s' },
  btnDisabled: { opacity: 0.35, cursor: 'not-allowed' },
  hint: { fontSize: 12, color: 'var(--text3)', lineHeight: 1.6, textAlign: 'center' },
}