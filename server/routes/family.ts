import expess from 'express'
import multer from 'multer'
import * as db from '../db/functions/family'

import { auth } from 'express-oauth2-jwt-bearer'

const router = expess.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const jwtCheck = auth({
  audience: 'https://chorequest/api',
  issuerBaseURL: 'https://manaia-2023-pete.au.auth0.com',
  tokenSigningAlg: 'RS256',
})

router.post('/create', jwtCheck, upload.single('image'), async (req, res) => {
  try {
    const { name, password } = req.body
    const auth_id = req.auth?.payload.sub as string

    const image = req.file ? req.file : null
    

    const familyFormData = { name, password }

    const family = await db.createFamily(familyFormData, image, auth_id)

    res.json(family)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/join', jwtCheck, async (req, res) => {
  try {
    const { familyFormData } = req.body
    const auth_id = req.auth?.payload.sub as string

    const chores = await db.joinFamily(familyFormData, auth_id)
    res.json(chores)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
