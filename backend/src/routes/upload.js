import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { nanoid } from 'nanoid'
import { getSession, addFilesToSession } from '../services/sessionStore.js'
import { processFile } from '../services/converter.js'

const router = Router()

const ALLOWED = ['.epub', '.pdf', '.mobi', '.cbz', '.cbr', '.txt']
const MAX_SIZE = 200 * 1024 * 1024 // 200 MB
const MAX_FILES = 5

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, nanoid(10) + ext)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ALLOWED.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error(`Formato não suportado: ${ext}`))
    }
  },
})

router.post('/:code', upload.array('files', MAX_FILES), async (req, res) => {
  const session = getSession(req.params.code)
  if (!session) {
    return res.status(404).json({ error: 'Sessão não encontrada ou expirada' })
  }

  const options = {
    cropPdf: req.body.cropPdf === 'true',
    convertMobi: req.body.convertMobi === 'true',
  }

  const processed = []
  for (const file of req.files) {
    const finalPath = await processFile(file.path, options)
    processed.push({
      id: nanoid(6),
      originalName: file.originalname,
      path: finalPath,
      filename: path.basename(finalPath),
      size: file.size,
      ext: path.extname(file.originalname).toLowerCase(),
    })
  }

  addFilesToSession(req.params.code, processed)
  res.json({ ok: true, uploaded: processed.length })
})

router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Ficheiro demasiado grande (máx. 200 MB)' })
  if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ error: 'Máximo de 5 ficheiros' })
  res.status(400).json({ error: err.message })
})

export default router