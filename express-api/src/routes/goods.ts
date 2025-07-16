import { Router } from 'express'
import { searchGoods, updateGoodsDetail } from '../controllers/goods'

const router = Router()

// 获取商品列表
router.get('/goods/items', searchGoods)

// 更新商品详情
router.post('/goods/detail/update', updateGoodsDetail)

export const goodsRouter = router
