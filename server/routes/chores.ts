import expess from 'express'
import * as db from '../db/functions/chores'
import { auth } from 'express-oauth2-jwt-bearer'

const router = expess.Router()

const jwtCheck = auth({
  audience: 'https://chorequest/api',
  issuerBaseURL: 'https://manaia-2023-pete.au.auth0.com',
  tokenSigningAlg: 'RS256',
})

//GET /api/v1/chores
// router.get('/', async (req, res) => {
//   try {
//     const chores = await db.getAllChores()
//     res.json(chores)
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: 'Internal server error' })
//   }
// })

router.get('/', jwtCheck, async (req, res) => {
  try {
    const auth_id = req.auth?.payload.sub as string

    const chores = await db.fetchFamilyChores(auth_id)

    if (!chores) {
      res.json({ message: "Couldn't find chores!" })
    } else {
      res.json({ chores })
    }
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.post('/', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const chore = req.body.chore
    console.log(`Route:`, chore)

    const newChore = await db.addChore(authId, chore)

    if (!newChore) {
      res.json({ message: "Couldn't add chores" })
    } else {
      res.json({ newChore })
    }
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.post('/accept', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const choreId = req.body.choreId
    console.log(`Route:`, choreId)

    const acceptedChore = await db.acceptChore(authId, choreId)

    if (!acceptedChore) {
      res.json({ message: "Couldn't add chores" })
    } else {
      res.json({ acceptedChore })
    }
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

// DELETE /api/v1/chores/:id
router.delete('/', jwtCheck, async (req, res) => {
  const authId = req.auth?.payload.sub as string
  const choreId = req.body.choreId
  try {
    await db.deleteChore(authId, choreId)
    res.sendStatus(204)
  } catch (err) {
    res.status(500).json({ err })
  }
})

export default router
