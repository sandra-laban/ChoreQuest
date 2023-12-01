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

router.post('/', async (req, res) => {
  const chore = req.body.chore
  console.log(`Route:`, chore)
  if (!chore) {
    res.status(400).send('Bad Request: Chore can not be empty')
    return
  }

  try {
    const addedChore = await db.addChore(chore)
    res.status(200).json(addedChore)
  } catch (err) {
    console.log(err)
    res.status(500).send('Could not add chore')
  }
})

export default router
