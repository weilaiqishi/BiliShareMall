import { Request, Response } from 'express'
import { getLoginKeyAndUrl, verifyLogin } from '../services/login'

// 获取登录二维码Key和URL
export const getLoginQRCode = async (req: Request, res: Response) => {
  const { userAgent } = req.body
  try {
    const qrData = await getLoginKeyAndUrl(userAgent)
    res.json(qrData)
  } catch (error) {
    console.error('getLoginQRCode error -> ', error)
    res.status(500).json({ error: '获取二维码失败' })
  }
}

// 验证登录状态并获取Cookie
export const verifyLoginStatus = async (req: Request, res: Response) => {
  const { key, userAgent } = req.body
  try {
    const loginResult = await verifyLogin(key, userAgent)
    res.json(loginResult)
  } catch (error) {
    res.status(500).json({ error: '验证登录失败' })
  }
}