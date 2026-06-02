import express from 'express'
import cors from 'cors'
import sessionRoutes from './routes/session.js'
import uploadRoutes from './routes/upload.js'
import downloadRoutes from './routes/download.js'
import userRoutes from './routes/user.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
app.use(express.json())

app.use('/api/session', sessionRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/download', downloadRoutes)
app.use('/api/user', userRoutes)

app.get('/health', (req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`)
})