import { Router } from 'express'
import { searchGoods } from '../controllers/goods'

const router = Router()

router.get('/goods/items', searchGoods)

export const goodsRouter = router
