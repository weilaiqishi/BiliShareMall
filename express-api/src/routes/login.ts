import { Router } from 'express'
import { getLoginQRCode, verifyLoginStatus } from '../controllers/login'

const router = Router()

// 获取登录二维码Key和URL
router.post('/login/qr', getLoginQRCode)

// 验证登录状态并获取Cookie
router.post('/login/verify', verifyLoginStatus)

export const loginRouter = router