import { useNavigate } from 'react-router-dom'

export default function PrivacyScreen() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <div style={s.container}>
        <button style={s.back} onClick={() => navigate('/')}>← Voltar</button>
        <h1 style={s.title}>Política de Privacidade</h1>
        <p style={s.date}>Última atualização: junho de 2026</p>

        <h2 style={s.h2}>1. Quem somos</h2>
        <p style={s.p}>O Leafdrop é um serviço que permite enviar ebooks diretamente para e-readers (Kobo, Kindle e outros) sem necessidade de cabos ou computador.</p>

        <h2 style={s.h2}>2. Dados que recolhemos</h2>
        <p style={s.p}>Quando crias uma conta, recolhemos:</p>
        <ul style={s.ul}>
          <li style={s.li}>Email e nome (via Google ou registo direto)</li>
          <li style={s.li}>Histórico de ficheiros enviados (nome e tamanho)</li>
          <li style={s.li}>Dispositivos que guardas voluntariamente</li>
        </ul>
        <p style={s.p}>Os ficheiros que envias são armazenados temporariamente no servidor e apagados após a sessão terminar. Não guardamos o conteúdo dos teus ebooks.</p>

        <h2 style={s.h2}>3. Como usamos os teus dados</h2>
        <p style={s.p}>Os teus dados são usados exclusivamente para:</p>
        <ul style={s.ul}>
          <li style={s.li}>Permitir o funcionamento do serviço</li>
          <li style={s.li}>Guardar o teu histórico de envios</li>
          <li style={s.li}>Identificar os teus dispositivos guardados</li>
        </ul>
        <p style={s.p}>Não vendemos, partilhamos nem usamos os teus dados para publicidade.</p>

        <h2 style={s.h2}>4. Serviços de terceiros</h2>
        <p style={s.p}>Utilizamos os seguintes serviços:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Supabase</strong> — base de dados e autenticação</li>
          <li style={s.li}><strong>Render</strong> — servidor backend</li>
          <li style={s.li}><strong>Vercel</strong> — alojamento do frontend</li>
          <li style={s.li}><strong>Google OAuth</strong> — login com Google (opcional)</li>
        </ul>

        <h2 style={s.h2}>5. Os teus direitos (RGPD)</h2>
        <p style={s.p}>Tens direito a:</p>
        <ul style={s.ul}>
          <li style={s.li}>Aceder aos teus dados</li>
          <li style={s.li}>Corrigir dados incorretos</li>
          <li style={s.li}>Apagar a tua conta e todos os dados associados</li>
          <li style={s.li}>Exportar os teus dados</li>
        </ul>
        <p style={s.p}>Podes apagar a tua conta a qualquer momento nas definições do perfil.</p>

        <h2 style={s.h2}>6. Contacto</h2>
        <p style={s.p}>Para questões sobre privacidade, contacta-nos por email.</p>

        <button style={s.backBtn} onClick={() => navigate('/')}>← Voltar ao início</button>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', padding: '40px 20px' },
  container: { maxWidth: 640, margin: '0 auto' },
  back: { background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14, marginBottom: 32, padding: 0 },
  title: { fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.5px' },
  date: { fontSize: 13, color: 'var(--text3)', marginBottom: 32 },
  h2: { fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 12, marginTop: 32 },
  p: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 12 },
  ul: { paddingLeft: 20, marginBottom: 12 },
  li: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 4 },
  backBtn: { width: '100%', padding: '14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 40 },
}