import { Router } from 'express'
import QRCode from 'qrcode'
import { createSession, getSession, deleteSession } from '../services/sessionStore.js'

const router = Router()

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

router.post('/create', async (req, res) => {
  const code = generateCode()
  createSession(code)

  const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'
  const uploadUrl = `${BASE_URL}/upload/${code}`

  const qrDataUrl = await QRCode.toDataURL(uploadUrl, {
    width: 300,
    margin: 2,
  })

  res.json({ code, qrDataUrl, uploadUrl })
})

router.get('/:code', (req, res) => {
  const session = getSession(req.params.code)
  if (!session) {
    return res.status(404).json({ error: 'Sessão não encontrada ou expirada' })
  }
  res.json({ code: session.code, files: session.files })
})

router.delete('/:code', (req, res) => {
  deleteSession(req.params.code)
  res.json({ ok: true })
})

export default router