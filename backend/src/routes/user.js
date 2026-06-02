import { Router } from 'express'
import { supabase } from '../services/supabase.js'

const router = Router()

// DELETE /api/user/:userId
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    // Apaga histórico e dispositivos (o perfil apaga-se em cascata)
    await supabase.from('send_history').delete().eq('user_id', userId)
    await supabase.from('devices').delete().eq('user_id', userId)
    await supabase.from('profiles').delete().eq('id', userId)

    // Apaga a conta do Supabase Auth (requer service role key)
    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) throw error

    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar conta.' })
  }
})

export default router