const API = import.meta.env.VITE_API_URL || ''

import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ACCEPTED = ['.epub', '.pdf', '.mobi', '.cbz', '.cbr', '.txt']
const MAX_FILES = 5

async function handleUpload() {
  if (files.length === 0) return
  setStatus('uploading')
  const formData = new FormData()
  files.forEach(f => formData.append('files', f))
  formData.append('cropPdf', options.cropPdf)
  formData.append('convertMobi', options.convertMobi)

  // Passa o userId se o utilizador estiver autenticado
  if (user?.id) {
    formData.append('userId', user.id)
  }

  try {
    await axios.post(`${API}/api/upload/${code}`, formData)
    setStatus('done')
    setFiles([])
  } catch {
    setStatus('error')
  }
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'var(--bg)',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 24,
    padding: '36px 32px',
    boxShadow: 'var(--shadow)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  leaf: { fontSize: 22 },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.5px',
    flex: 1,
  },
  codeBadge: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: 'monospace',
    background: 'var(--accent-bg)',
    color: 'var(--accent)',
    border: '1px solid var(--accent2)',
    borderRadius: 8,
    padding: '4px 10px',
    letterSpacing: '0.1em',
  },
  dropZone: {
    border: '1.5px dashed var(--border)',
    borderRadius: 16,
    padding: '32px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: 16,
    transition: 'all .2s',
    background: 'var(--bg)',
  },
  dropActive: {
    borderColor: 'var(--accent)',
    background: 'var(--accent-bg)',
  },
  dropIcon: {
    fontSize: 24,
    color: 'var(--text3)',
    marginBottom: 8,
    fontWeight: 300,
  },
  dropText: {
    fontSize: 14,
    color: 'var(--text2)',
    marginBottom: 4,
  },
  dropHint: {
    fontSize: 11,
    color: 'var(--text3)',
    letterSpacing: '0.05em',
  },
  fileList: { marginBottom: 16 },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    marginBottom: 6,
  },
  fileExt: {
    fontSize: 9,
    fontWeight: 700,
    background: 'var(--bg3)',
    color: 'var(--text2)',
    borderRadius: 4,
    padding: '2px 5px',
    minWidth: 34,
    textAlign: 'center',
    letterSpacing: '0.05em',
  },
  fileName: {
    flex: 1,
    fontSize: 13,
    color: 'var(--text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileSize: {
    fontSize: 11,
    color: 'var(--text3)',
    whiteSpace: 'nowrap',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text3)',
    cursor: 'pointer',
    fontSize: 13,
    padding: '0 2px',
    lineHeight: 1,
  },
  togglesBox: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 16,
  },
  togglesTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 12,
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    cursor: 'pointer',
  },
  toggle: {
    width: 36,
    height: 20,
    background: 'var(--bg3)',
    borderRadius: 10,
    position: 'relative',
    flexShrink: 0,
    transition: 'background .2s',
    cursor: 'pointer',
  },
  toggleOn: {
    background: 'var(--accent)',
  },
  toggleThumb: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 16,
    height: 16,
    background: '#fff',
    borderRadius: '50%',
    transition: 'left .2s',
  },
  toggleThumbOn: {
    left: 18,
  },
  toggleLabel: {
    display: 'block',
    fontSize: 13,
    color: 'var(--text)',
    fontWeight: 500,
  },
  toggleHint: {
    display: 'block',
    fontSize: 11,
    color: 'var(--text3)',
    marginTop: 2,
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity .15s',
    marginBottom: 12,
  },
  btnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
  success: {
    padding: '12px 16px',
    background: 'var(--accent-bg)',
    color: 'var(--accent)',
    border: '1px solid var(--accent2)',
    borderRadius: 10,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  error: {
    padding: '12px 16px',
    background: '#fff0f0',
    color: '#c00',
    borderRadius: 10,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 1.5,
  },
}