import expess from 'express'
import * as db from '../db/functions/chores'
import { auth } from 'express-oauth2-jwt-bearer'

const router = expess.Router()

const jwtCheck = auth({
  audience: 'https://chorequest/api',
  issuerBaseURL: 'https://manaia-2023-pete.au.auth0.com',
  tokenSigningAlg: 'RS256',
})

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

router.get('/list', jwtCheck, async (req, res) => {
  try {
    const auth_id = req.auth?.payload.sub as string

    const chores = await db.fetchFamilyChorelist(auth_id)

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

router.get('/list/recent', jwtCheck, async (req, res) => {
  try {
    const auth_id = req.auth?.payload.sub as string
    const chores = await db.fetchFamilyRecents(auth_id)

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

    const acceptedChore = await db.acceptChore(authId, choreId)

    if (!acceptedChore) {
      res.json({ message: "Couldn't accept chore" })
    } else {
      res.json({ acceptedChore })
    }
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.patch('/complete', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const choreId = req.body.choreId

    const completedChoreData = await db.finishChore(authId, choreId)

    if (!completedChoreData) {
      res.json({ message: "Couldn't complete chore" })
    } else {
      res.json(completedChoreData)
    }
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.patch('/complete/confirm', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const choreId = req.body.choreId

    const choreData = await db.confirmChore(authId, choreId)

    if (!choreData) {
      res.json({ message: "Couldn't complete chore" })
    } else {
      res.json(choreData)
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

router.delete('/chorelist', jwtCheck, async (req, res) => {
  const authId = req.auth?.payload.sub as string
  const choreId = req.body.choreId
  try {
    await db.unassignChore(authId, choreId)
    res.sendStatus(204)
  } catch (err) {
    res.status(500).json({ err })
  }
})

router.post('/chorelist', jwtCheck, async (req, res) => {
  const authId = req.auth?.payload.sub as string
  const choreId = req.body.choreId
  const kid = req.body.kid
  console.log(choreId, kid)
  try {
    await db.assignChore(authId, choreId, kid)
    res.sendStatus(204)
  } catch (err) {
    res.status(500).json({ err })
  }
})

router.patch('/chorelist', jwtCheck, async (req, res) => {
  const authId = req.auth?.payload.sub as string
  const choreId = req.body.choreId
  try {
    const choreData = await db.rejectChore(authId, choreId)

    res.status(201).json(choreData)
  } catch (err) {
    res.status(500).json({ err })
  }
})

export default router
