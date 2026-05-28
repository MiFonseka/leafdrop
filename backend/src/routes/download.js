import { Router } from 'express'
import path from 'path'
import fs from 'fs'
import { getSession } from '../services/sessionStore.js'

const router = Router()

router.get('/:code', (req, res) => {
  const session = getSession(req.params.code)
  if (!session) {
    return res.status(404).json({ error: 'Sessão não encontrada ou expirada' })
  }

  res.json({
    files: session.files.map(f => ({
      id: f.id,
      name: f.originalName,
      size: f.size,
      ext: f.ext,
      downloadUrl: `/api/download/${req.params.code}/${f.id}`,
    })),
  })
})

router.get('/:code/:fileId', (req, res) => {
  const session = getSession(req.params.code)
  if (!session) {
    return res.status(404).json({ error: 'Sessão não encontrada ou expirada' })
  }

  const file = session.files.find(f => f.id === req.params.fileId)
  if (!file) {
    return res.status(404).json({ error: 'Ficheiro não encontrado' })
  }

  const absolutePath = path.resolve(file.path)
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ error: 'Ficheiro já não existe no servidor' })
  }

  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`)
  res.sendFile(absolutePath)
})

export default router