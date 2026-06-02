import { useNavigate } from 'react-router-dom'

export default function NotFoundScreen() {
  const navigate = useNavigate()

  return (
    <div className="page-center">
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={s.emoji}>🍃</div>
        <h1 style={s.code}>404</h1>
        <p style={s.title}>Página não encontrada</p>
        <p style={s.subtitle}>O link que seguiste não existe ou foi removido.</p>
        <button style={s.btn} onClick={() => navigate('/')}>
          Voltar ao início
        </button>
      </div>
    </div>
  )
}

const s = {
  emoji: { fontSize: 48, marginBottom: 16 },
  code: { fontSize: 64, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, letterSpacing: '-2px' },
  title: { fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'var(--text2)', marginBottom: 32, lineHeight: 1.5 },
  btn: { padding: '14px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
}