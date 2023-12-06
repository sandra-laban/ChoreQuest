import express from 'express'
import * as db from '../db/functions/prizes'
import { auth } from 'express-oauth2-jwt-bearer'
import { useParams } from 'react-router-dom'

const router = express.Router()

const jwtCheck = auth({
  audience: 'https://chorequest/api',
  issuerBaseURL: 'https://manaia-2023-pete.au.auth0.com',
  tokenSigningAlg: 'RS256',
})

// GET /api/v1/prizes
router.get('/', jwtCheck, async (req, res) => {
  try {
    const auth_id = req.auth?.payload.sub as string
    const prizes = await db.getAllPrizes(auth_id)
    res.status(200).json({ prizes })
  } catch (error) {
    res.status(500).json({ message: 'Unable to get prizes' })
  }
})

router.get('/:id', jwtCheck, async (req, res) => {
  try {
    // const auth_id = req.auth?.payload.sub as string
    const prizeId = Number(req.params.id)
    const prize = await db.getPrize(prizeId)
    res.status(200).json({ prize })
  } catch (error) {
    res.status(500).json({ message: 'Unable to get prize' })
  }
})

// POST /api/v1/prizes
router.post('/', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const prize = req.body.prize
    const addedPrize = await db.addPrize(authId, prize)
    if (!addedPrize) {
      res.json({ message: 'Unable to add prize' })
    } else {
      console.log(prize.price)
      res.json({ addedPrize })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Unable to add prize' })
  }
})

// PATCH /api/v1/prizes
router.patch('/', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const editPrize = req.body.editPrize
    const prizeId = req.body.prizeId
    const editedPrize = await db.editPrize(authId, prizeId, editPrize)
    if (!editedPrize) {
      res.json({ message: 'Unable to edit prize' })
    } else {
      res.json({ editedPrize })
    }
  } catch (error) {
    res.status(500).json({ message: 'Unable to edit prizze' })
  }
})

router.patch('/claim', jwtCheck, async (req, res) => {
  try {
    const authId = req.auth?.payload.sub as string
    const prizeId = req.body.prizeId
    const claimedPrize = await db.claimPrize(authId, prizeId)
    if (!claimedPrize) {
      res.json({ message: 'Unable to edit prize' })
    } else {
      res.json({ claimedPrize })
    }
  } catch (error) {
    res.status(500).json({ message: 'Unable to edit prizze' })
  }
})

export default router
