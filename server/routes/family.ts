import expess from 'express'
import * as db from '../db/functions/family'

const router = expess.Router()

router.post('/create', async (req, res) => {
  try {
    const { familyFormData, userId } = req.body
    const family = await db.createFamily(familyFormData, userId)
    res.json(family)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/join', async (req, res) => {
  try {
    const { familyFormData, userId } = req.body
    const chores = await db.joinFamily(familyFormData, userId)
    res.json(chores)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
