import express from 'express'
import {
  addUser,
  fetchUser,
  removeUser,
  updateUser,
  createParent,
} from '../db/functions/users'
import { auth } from 'express-oauth2-jwt-bearer'

const router = express.Router()

const jwtCheck = auth({
  audience: 'https://chorequest/api',
  issuerBaseURL: 'https://manaia-2023-pete.au.auth0.com/',
  tokenSigningAlg: 'RS256',
})

router.get('/', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string

    const profile = await fetchUser(authId)

    if (!profile) {
      res.json({ message: 'Need to create profile' })
    } else {
      res.json({ profile })
    }
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.patch('/parentify', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const childId = req.body.childId

    const newParent = await createParent(authId, childId)

    if (!newParent) {
      res.json({ message: 'Could not make parent' })
    } else {
      res.json({ newParent })
    }
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const newUser = req.body
    const profile = await addUser(newUser)
    res.json({ profile })
  } catch (err) {
    res.status(500).json({
      message: 'an error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.patch('/', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const updatedUser = req.body
    const renewedUser = await updateUser(authId, updatedUser)
    res.json({ renewedUser })
  } catch (err) {
    res.status(500).json({
      message: 'an error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.delete('/', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const userId = req.body.userId

    const deletedUser = await removeUser(authId, userId)

    if (!deletedUser) {
      res.json({ message: 'Could not delete user' })
    } else {
      res.json({ deletedUser })
    }
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

export default router
