import express from 'express'
import * as db from '../db/functions/prizes'
import { auth } from 'express-oauth2-jwt-bearer'

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
    res.status(200).json(prizes)
  } catch (error) {
    res.sendStatus(500).json({ message: 'Unable to get prizes' })
  }
})

export default router
