import expess from 'express'
import * as db from '../db/functions/notifications'
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

    const notifications = await db.getUserNotifications(auth_id)

    if (!notifications) {
      res.json({ message: "Couldn't find notifications!" })
    } else {
      res.json({ notifications })
    }
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.delete('/', jwtCheck, async (req, res) => {
  try {
    const notificationId = req.body.notification_id

    await db.deleteNotification(notificationId)
    return res.json({ message: 'Notification deleted' })
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

export default router
