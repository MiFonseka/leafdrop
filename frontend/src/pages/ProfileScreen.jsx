import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useNavigate } from 'react-router-dom'

export default function ProfileScreen() {
  const [user, setUser] = useState(null)
  const [history, setHistory] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate('/login')
        return
      }
      setUser(data.user)
      loadData(data.user.id)
    })
  }, [])

  async function loadData(userId) {
    const [historyRes, devicesRes] = await Promise.all([
      supabase.from('send_history').select('*').eq('user_id', userId).order('sent_at', { ascending: false }).limit(20),
      supabase.from('devices').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ])
    setHistory(historyRes.data || [])
    setDevices(devicesRes.data || [])
    setLoading(false)
  }

  async function deleteDevice(id) {
    await supabase.from('devices').delete().eq('id', id)
    setDevices(prev => prev.filter(d => d.id !== id))
  }

  async function logout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return <div className="page-center"><p style={{ color: 'var(--text3)' }}>A carregar...</p></div>

  return (
    <div className="page-center">
      <div className="card" style={{ maxWidth: 480 }}>
        <div style={s.header}>
          <div>
            <p style={s.name}>{user?.user_metadata?.full_name || user?.email}</p>
            <p style={s.email}>{user?.email}</p>
          </div>
          <button style={s.logoutBtn} onClick={logout}>Sair</button>
        </div>

        <div style={s.section}>
          <p style={s.sectionTitle}>Dispositivos</p>
          {devices.length === 0 ? (
            <p style={s.empty}>Nenhum dispositivo guardado ainda.</p>
          ) : (
            devices.map(d => (
              <div key={d.id} style={s.row}>
                <span style={s.deviceIcon}>{d.type === 'kindle' ? '📖' : '📚'}</span>
                <span style={s.rowText}>{d.name}</span>
                <span style={s.rowBadge}>{d.type}</span>
                <button style={s.deleteBtn} onClick={() => deleteDevice(d.id)}>✕</button>
              </div>
            ))
          )}
        </div>

        <div style={s.section}>
          <p style={s.sectionTitle}>Histórico de envios</p>
          {history.length === 0 ? (
            <p style={s.empty}>Nenhum envio ainda.</p>
          ) : (
            history.map(h => (
              <div key={h.id} style={s.row}>
                <span style={s.rowText}>{h.filename}</span>
                <span style={s.rowDate}>{new Date(h.sent_at).toLocaleDateString('pt-PT')}</span>
              </div>
            ))
          )}
        </div>

        <button style={s.homeBtn} onClick={() => navigate('/')}>← Voltar ao início</button>
      </div>
    </div>
  )
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  name: { fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 2 },
  email: { fontSize: 13, color: 'var(--text3)' },
  logoutBtn: { background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: 'var(--text2)', cursor: 'pointer' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 },
  empty: { fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '16px 0' },
  row: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 6 },
  deviceIcon: { fontSize: 16 },
  rowText: { flex: 1, fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowBadge: { fontSize: 10, fontWeight: 600, background: 'var(--bg3)', color: 'var(--text2)', borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase' },
  rowDate: { fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' },
  deleteBtn: { background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14, padding: '0 4px' },
  homeBtn: { width: '100%', padding: '12px', background: 'none', border: '1px solid var(--border)', borderRadius: 12, fontSize: 14, color: 'var(--text2)', cursor: 'pointer', marginTop: 8 },
}