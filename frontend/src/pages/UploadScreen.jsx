const API = import.meta.env.VITE_API_URL || ''

import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { supabase } from '../lib/supabase.js'

const ACCEPTED = ['.epub', '.pdf', '.mobi', '.cbz', '.cbr', '.txt']
const MAX_FILES = 5

export default function UploadScreen({ user }) {
  const { code } = useParams()
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [options, setOptions] = useState({ cropPdf: false, convertMobi: false })
  const [status, setStatus] = useState('idle')
  const [dragOver, setDragOver] = useState(false)
  const [showSaveDevice, setShowSaveDevice] = useState(false)
  const [deviceName, setDeviceName] = useState('')
  const [deviceType, setDeviceType] = useState('kobo')
  const [deviceSaved, setDeviceSaved] = useState(false)
  const inputRef = useRef()

  function addFiles(newFiles) {
    const valid = Array.from(newFiles).filter(f => {
      const ext = '.' + f.name.split('.').pop().toLowerCase()
      return ACCEPTED.includes(ext)
    })
    setFiles(prev => [...prev, ...valid].slice(0, MAX_FILES))
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    if (files.length === 0) return
    setStatus('uploading')
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    formData.append('cropPdf', options.cropPdf)
    formData.append('convertMobi', options.convertMobi)

    if (user?.id) {
      formData.append('userId', user.id)
    }

    try {
      await axios.post(`${API}/api/upload/${code}`, formData)
      setStatus('done')
      setFiles([])

      // Se o utilizador está autenticado, pergunta se quer guardar o dispositivo
      if (user?.id) {
        const { data } = await supabase
          .from('devices')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
        
        // Só pergunta se não tiver dispositivos guardados ainda
        if (!data || data.length === 0) {
          setShowSaveDevice(true)
        } else {
          setTimeout(() => navigate('/'), 2000)
        }
      } else {
        setTimeout(() => navigate('/'), 2000)
      }
    } catch {
      setStatus('error')
    }
  }

  async function saveDevice() {
    if (!deviceName.trim()) return
    await supabase.from('devices').insert({
      user_id: user.id,
      name: deviceName.trim(),
      type: deviceType,
    })
    setDeviceSaved(true)
    setTimeout(() => navigate('/'), 1500)
  }

  const hasPdf = files.some(f => f.name.toLowerCase().endsWith('.pdf'))
  const hasMobi = files.some(f => f.name.toLowerCase().endsWith('.mobi'))

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <span style={s.leaf}>🍃</span>
          <h1 style={s.title}>Leafdrop</h1>
          <span style={s.codeBadge}>{code}</span>
        </div>

        {/* Popup guardar dispositivo */}
        {showSaveDevice && (
          <div style={s.saveDeviceBox}>
            <p style={s.saveDeviceTitle}>Guardar este dispositivo?</p>
            <p style={s.saveDeviceSubtitle}>Dá um nome para identificares nas próximas vezes</p>
            <input
              style={s.deviceInput}
              placeholder="ex: Kobo Clara, Kindle Paperwhite..."
              value={deviceName}
              onChange={e => setDeviceName(e.target.value)}
              autoFocus
            />
            <div style={s.deviceTypeRow}>
              {['kobo', 'kindle'].map(t => (
                <button
                  key={t}
                  style={{ ...s.deviceTypeBtn, ...(deviceType === t ? s.deviceTypeBtnActive : {}) }}
                  onClick={() => setDeviceType(t)}
                >
                  {t === 'kobo' ? '📚 Kobo' : '📖 Kindle'}
                </button>
              ))}
            </div>
            <button
              style={{ ...s.btn, ...(deviceSaved ? {} : {}), marginBottom: 8 }}
              onClick={saveDevice}
              disabled={deviceSaved}
            >
              {deviceSaved ? 'Guardado! ✓' : 'Guardar dispositivo'}
            </button>
            <button style={s.skipBtn} onClick={() => { setShowSaveDevice(false); setTimeout(() => navigate('/'), 500) }}>
              Não, obrigado
            </button>
          </div>
        )}

        {!showSaveDevice && (
          <>
            <div
              style={{ ...s.dropZone, ...(dragOver ? s.dropActive : {}) }}
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPTED.join(',')}
                style={{ display: 'none' }}
                onChange={e => addFiles(e.target.files)}
              />
              <div style={s.dropIcon}>↑</div>
              <p style={s.dropText}>
                {files.length === 0
                  ? 'Arrasta ou clica para selecionar'
                  : `${files.length} de ${MAX_FILES} ficheiros`}
              </p>
              <p style={s.dropHint}>EPUB · PDF · MOBI · CBZ · CBR · TXT</p>
            </div>

            {files.length > 0 && (
              <div style={s.fileList}>
                {files.map((f, i) => (
                  <div key={i} style={s.fileRow}>
                    <span style={s.fileExt}>{f.name.split('.').pop().toUpperCase()}</span>
                    <span style={s.fileName}>{f.name}</span>
                    <span style={s.fileSize}>{formatSize(f.size)}</span>
                    <button style={s.removeBtn} onClick={() => removeFile(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {(hasPdf || hasMobi) && (
              <div style={s.togglesBox}>
                <p style={s.togglesTitle}>Conversões opcionais</p>
                {hasPdf && (
                  <label style={s.toggleRow}>
                    <div
                      style={{ ...s.toggle, ...(options.cropPdf ? s.toggleOn : {}) }}
                      onClick={() => setOptions(o => ({ ...o, cropPdf: !o.cropPdf }))}
                    >
                      <div style={{ ...s.toggleThumb, ...(options.cropPdf ? s.toggleThumbOn : {}) }} />
                    </div>
                    <span>
                      <span style={s.toggleLabel}>Cortar margens do PDF</span>
                      <span style={s.toggleHint}>Remove espaço em branco excessivo</span>
                    </span>
                  </label>
                )}
                {hasMobi && (
                  <label style={s.toggleRow}>
                    <div
                      style={{ ...s.toggle, ...(options.convertMobi ? s.toggleOn : {}) }}
                      onClick={() => setOptions(o => ({ ...o, convertMobi: !o.convertMobi }))}
                    >
                      <div style={{ ...s.toggleThumb, ...(options.convertMobi ? s.toggleThumbOn : {}) }} />
                    </div>
                    <span>
                      <span style={s.toggleLabel}>Converter MOBI para EPUB</span>
                      <span style={s.toggleHint}>Requer Calibre no servidor</span>
                    </span>
                  </label>
                )}
              </div>
            )}

            <button
              style={{ ...s.btn, ...(files.length === 0 || status === 'uploading' ? s.btnDisabled : {}) }}
              onClick={handleUpload}
              disabled={files.length === 0 || status === 'uploading'}
            >
              {status === 'uploading'
                ? 'A enviar...'
                : `Enviar ${files.length > 0 ? files.length : ''} ficheiro${files.length !== 1 ? 's' : ''}`}
            </button>

            {status === 'done' && !showSaveDevice && (
              <div style={s.success}>Enviado com sucesso!</div>
            )}
            {status === 'error' && (
              <div style={s.error}>
                Erro ao enviar. O código pode ter expirado — volta ao Kobo e tenta novamente.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg)' },
  card: { width: '100%', maxWidth: 440, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 24, padding: '36px 32px', boxShadow: 'var(--shadow)' },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
  leaf: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px', flex: 1 },
  codeBadge: { fontSize: 12, fontWeight: 700, fontFamily: 'monospace', background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent2)', borderRadius: 8, padding: '4px 10px', letterSpacing: '0.1em' },
  dropZone: { border: '1.5px dashed var(--border)', borderRadius: 16, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 16, transition: 'all .2s', background: 'var(--bg)' },
  dropActive: { borderColor: 'var(--accent)', background: 'var(--accent-bg)' },
  dropIcon: { fontSize: 24, color: 'var(--text3)', marginBottom: 8, fontWeight: 300 },
  dropText: { fontSize: 14, color: 'var(--text2)', marginBottom: 4 },
  dropHint: { fontSize: 11, color: 'var(--text3)', letterSpacing: '0.05em' },
  fileList: { marginBottom: 16 },
  fileRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 6 },
  fileExt: { fontSize: 9, fontWeight: 700, background: 'var(--bg3)', color: 'var(--text2)', borderRadius: 4, padding: '2px 5px', minWidth: 34, textAlign: 'center', letterSpacing: '0.05em' },
  fileName: { flex: 1, fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileSize: { fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' },
  removeBtn: { background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 13, padding: '0 2px', lineHeight: 1 },
  togglesBox: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 },
  togglesTitle: { fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 },
  toggleRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, cursor: 'pointer' },
  toggle: { width: 36, height: 20, background: 'var(--bg3)', borderRadius: 10, position: 'relative', flexShrink: 0, transition: 'background .2s', cursor: 'pointer' },
  toggleOn: { background: 'var(--accent)' },
  toggleThumb: { position: 'absolute', top: 2, left: 2, width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: 'left .2s' },
  toggleThumbOn: { left: 18 },
  toggleLabel: { display: 'block', fontSize: 13, color: 'var(--text)', fontWeight: 500 },
  toggleHint: { display: 'block', fontSize: 11, color: 'var(--text3)', marginTop: 2 },
  btn: { width: '100%', padding: '14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'opacity .15s', marginBottom: 12 },
  btnDisabled: { opacity: 0.35, cursor: 'not-allowed' },
  success: { padding: '12px 16px', background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent2)', borderRadius: 10, fontSize: 13, textAlign: 'center', lineHeight: 1.5, marginBottom: 8 },
  error: { padding: '12px 16px', background: '#fff0f0', color: '#c00', borderRadius: 10, fontSize: 13, textAlign: 'center', lineHeight: 1.5 },
  saveDeviceBox: { textAlign: 'center' },
  saveDeviceTitle: { fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 6 },
  saveDeviceSubtitle: { fontSize: 13, color: 'var(--text2)', marginBottom: 20, lineHeight: 1.5 },
  deviceInput: { width: '100%', padding: '12px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text)', outline: 'none', marginBottom: 12 },
  deviceTypeRow: { display: 'flex', gap: 8, marginBottom: 16 },
  deviceTypeBtn: { flex: 1, padding: '10px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text2)', cursor: 'pointer' },
  deviceTypeBtnActive: { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-bg)' },
  skipBtn: { width: '100%', padding: '12px', background: 'none', border: '1px solid var(--border)', borderRadius: 12, fontSize: 14, color: 'var(--text3)', cursor: 'pointer' },
}