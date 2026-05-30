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

router.get('/kobo', async (req, res) => {
  const code = generateCode()
  createSession(code)

  const BASE_URL = process.env.BASE_URL || 'http://192.168.1.76:5173'
  const uploadUrl = `${BASE_URL}/upload/${code}`

  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Leafdrop</title>
  <style>
    body { font-family: Georgia, serif; text-align: center; padding: 20px; background: #fff; color: #000; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    p { font-size: 14px; color: #666; }
    img { border: 1px solid #ccc; padding: 8px; margin: 16px 0; }
    .letter { display: inline-block; width: 40px; height: 48px; line-height: 48px; background: #f4f4f4; border: 1px solid #ccc; margin: 2px; font-size: 22px; font-weight: bold; font-family: monospace; }
    .file { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; display: block; text-decoration: none; color: #000; }
    small { color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Leafdrop</h1>
  <p>Envia ebooks para este dispositivo</p>
  <img src="/api/session/qr/${code}" width="220" height="220" alt="QR Code">
  <p><small>ou introduz o código em leafdrop.app</small></p>
  <div>
    ${code.split('').map(c => `<span class="letter">${c}</span>`).join('')}
  </div>
  <div id="files"><p><small>A espera de ficheiros...</small></p></div>
  <script>
    setInterval(function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/download/${code}');
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          if (data.files && data.files.length > 0) {
            var html = '';
            for (var i = 0; i < data.files.length; i++) {
              var f = data.files[i];
              html += '<a class="file" href="' + f.downloadUrl + '" download>' + f.name + '</a>';
            }
            document.getElementById('files').innerHTML = html;
          }
        }
      };
      xhr.send();
    }, 3000);
  </script>
</body>
</html>`)
})

router.get('/qr/:code', async (req, res) => {
  const BASE_URL = process.env.BASE_URL || 'http://192.168.1.76:5173'
  const uploadUrl = `${BASE_URL}/upload/${req.params.code}`
  const qrBuffer = await QRCode.toBuffer(uploadUrl, { width: 250, margin: 2 })
  res.setHeader('Content-Type', 'image/png')
  res.send(qrBuffer)
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