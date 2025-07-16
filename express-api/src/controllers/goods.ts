import { Request, Response } from 'express'
import { searchGoodsItems, updateGoodsItemDetail } from '../services/goods'
import { SearchGoodsItemsParams } from '../../../types/goods'

export const searchGoods = (req: Request, res: Response) => {
  try {
    const params: SearchGoodsItemsParams = {
      name: req.query.name as string | undefined,
      priceFlow: req.query.priceFlow ? Number(req.query.priceFlow) : undefined,
      priceCeil: req.query.priceCeil ? Number(req.query.priceCeil) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20,
    }

    const result = searchGoodsItems(params)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ error: error.message || '查询商品失败' })
  }
}

/**
 * 更新商品详情
 * 接收商品ID和店铺ID，请求B站接口获取商品详情，并更新数据库
 */
export const updateGoodsDetail = async (req: Request, res: Response) => {
  try {
    const { itemsId, shopId, cookie } = req.body

    // 验证参数
    if (!itemsId || !shopId) {
      res.status(400).json({ error: '缺少必要参数：itemsId 或 shopId' })
      return
    }

    // 调用服务函数更新商品详情
    const result = await updateGoodsItemDetail({ itemsId, shopId })

    if (result) {
      res
        .status(200)
        .json({ success: true, message: `成功更新商品 ${itemsId} 的详情` })
    } else {
      res
        .status(500)
        .json({ success: false, error: `更新商品 ${itemsId} 详情失败` })
    }
  } catch (error: any) {
    console.error('更新商品详情出错:', error)
    res.status(500).json({ error: error.message || '更新商品详情时发生错误' })
  }
}
