import expess from 'express'
import * as db from '../db/functions/chores'

const router = expess.Router()

//GET /api/v1/chores
router.get('/', async (req, res) => {
  try {
    const chores = await db.getAllChores()
    res.json(chores)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
