import express from 'express'
import {
  addUser,
  fetchAllUsers,
  fetchUser,
  removeUser,
} from '../db/functions/users'

const router = express.Router()

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const user = await fetchUser(id)
    res.json(user)
  } catch (err) {
    res.status(500).json({
      message: 'an error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const users = await fetchAllUsers()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({
      message: 'an error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const newUser = req.body
    const user = await addUser(newUser)
    res.json({ user })
  } catch (err) {
    res.status(500).json({
      message: 'an error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const deletedUser = await removeUser(id)
    res.json(deletedUser)
  } catch (err) {
    res.status(500).json({
      message: 'an error occurred',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

export default router
