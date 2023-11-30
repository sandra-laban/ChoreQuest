import expess from 'express'
import multer from 'multer'
import * as db from '../db/functions/family'

const router = expess.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { name, password, userId } = req.body
    const image = req.file ? req.file : null

    const familyFormData = { name, password }

    const family = await db.createFamily(familyFormData, image, userId)

    res.json(family)
  } catch (err) {
    console.error(err)
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
