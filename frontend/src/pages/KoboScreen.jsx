import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

export default function KoboScreen() {
  const [session, setSession] = useState(null)
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)
  const pollRef = useRef(null)

  useEffect(() => {
    axios.post('/api/session/create')
      .then(res => setSession(res.data))
      .catch(() => setError('Não foi possível ligar ao servidor.'))
  }, [])

  useEffect(() => {
    if (!session) return
    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`/api/download/${session.code}`)
        setFiles(res.data.files)
      } catch {}
    }, 3000)
    return () => clearInterval(pollRef.current)
  }, [session])

  if (error) return <div style={s.center}><p style={s.error}>{error}</p></div>
  if (!session) return <div style={s.center}><p style={s.muted}>A gerar código...</p></div>

  return (
    <div style={s.page}>
      <h1 style={s.title}>Leafdrop</h1>
      <p style={s.subtitle}>Envia ebooks para este dispositivo</p>

      <img src={session.qrDataUrl} alt="QR Code" style={s.qr} />

      <div style={s.divider}>
        <span style={s.dividerText}>ou introduz o código em leafdrop.app</span>
      </div>

      <div style={s.codeRow}>
        {session.code.split('').map((char, i) => (
          <span key={i} style={s.codeLetter}>{char}</span>
        ))}
      </div>

      {files.length > 0 ? (
        <div style={s.fileList}>
          <p style={s.fileListTitle}>Prontos a descarregar</p>
          {files.map(file => (
            <a key={file.id} href={file.downloadUrl} style={s.fileItem} download>
              <span style={s.fileName}>{file.name}</span>
              <span style={s.fileSize}>{formatSize(file.size)}</span>
            </a>
          ))}
        </div>
      ) : (
        <p style={s.waiting}>À espera de ficheiros...</p>
      )}
    </div>
  )
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const s = {
  page: {
    maxWidth: 360,
    margin: '0 auto',
    padding: '32px 16px',
    fontFamily: 'Georgia, serif',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 24,
  },
  qr: {
    width: 220,
    height: 220,
    border: '1px solid #ddd',
    borderRadius: 12,
    padding: 8,
    background: '#fff',
    marginBottom: 20,
  },
  divider: {
    margin: '16px 0',
    borderTop: '1px solid #ddd',
    paddingTop: 16,
  },
  dividerText: {
    fontSize: 12,
    color: '#999',
  },
  codeRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
    margin: '16px 0 24px',
  },
  codeLetter: {
    display: 'inline-block',
    width: 42,
    lineHeight: '50px',
    background: '#f4f4f4',
    border: '1px solid #ccc',
    borderRadius: 8,
    fontSize: 22,
    fontWeight: 700,
    fontFamily: 'monospace',
    textAlign: 'center',
    color: '#111',
  },
  fileList: {
    textAlign: 'left',
    border: '1px solid #ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
  },
  fileListTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '10px 14px',
    borderBottom: '1px solid #ddd',
    background: '#f9f9f9',
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    borderBottom: '1px solid #f0f0f0',
    textDecoration: 'none',
    color: '#222',
    fontSize: 13,
  },
  fileName: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: 8,
  },
  fileSize: {
    fontSize: 11,
    color: '#999',
    whiteSpace: 'nowrap',
  },
  waiting: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 8,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  muted: {
    fontSize: 14,
    color: '#aaa',
  },
  error: {
    fontSize: 14,
    color: '#c00',
  },
}