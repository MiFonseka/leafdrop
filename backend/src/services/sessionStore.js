const sessions = new Map()
const SESSION_TTL = 10 * 60 * 1000 // 10 minutos

export function createSession(code) {
  const session = {
    code,
    files: [],
    createdAt: Date.now(),
    lastSeen: Date.now(),
  }
  sessions.set(code, session)
  scheduleExpiry(code)
  return session
}

export function getSession(code) {
  const session = sessions.get(code)
  if (!session) return null
  session.lastSeen = Date.now()
  return session
}

export function addFilesToSession(code, files) {
  const session = sessions.get(code)
  if (!session) return false
  session.files.push(...files)
  session.lastSeen = Date.now()
  return true
}

export function deleteSession(code) {
  sessions.delete(code)
}

function scheduleExpiry(code) {
  setTimeout(() => {
    const session = sessions.get(code)
    if (!session) return
    const age = Date.now() - session.lastSeen
    if (age >= SESSION_TTL) {
      sessions.delete(code)
      console.log(`Sessão ${code} expirou`)
    } else {
      scheduleExpiry(code)
    }
  }, SESSION_TTL)
}