// ... existing code ...
import { GoodsItemInfoAll } from '../../../types/goods'
import { SearchGoodsItemsParams } from '../../../types/goods'
import { PaginatedResult } from '../../../types/page'
import { db } from './sqlite' // 导入 db 实例

export function searchGoodsItems(
  params: SearchGoodsItemsParams,
): PaginatedResult<GoodsItemInfoAll> {
  let query = 'SELECT * FROM search_goods_items WHERE 1=1'
  let countQuery = 'SELECT COUNT(*) FROM search_goods_items WHERE 1=1'
  const queryParams: (string | number)[] = []
  const countQueryParams: (string | number)[] = []

  if (params.name) {
    query += ' AND name LIKE ?'
    countQuery += ' AND name LIKE ?'
    queryParams.push(`%${params.name}%`)
    countQueryParams.push(`%${params.name}%`)
  }

  if (params.priceFlow !== undefined) {
    if (typeof params.priceFlow !== 'number' || isNaN(params.priceFlow)) {
      throw new Error('priceFlow must be a valid number')
    }
    query += ' AND price >= ?'
    countQuery += ' AND price >= ?'
    queryParams.push(params.priceFlow)
    countQueryParams.push(params.priceFlow)
  }

  if (params.priceCeil !== undefined) {
    if (typeof params.priceCeil !== 'number' || isNaN(params.priceCeil)) {
      throw new Error('priceCeil must be a valid number')
    }
    query += ' AND price <= ?'
    countQuery += ' AND price <= ?'
    queryParams.push(params.priceCeil)
    countQueryParams.push(params.priceCeil)
  }

  const offset = (params.page - 1) * params.pageSize
  query += ` LIMIT ? OFFSET ?`
  queryParams.push(params.pageSize, offset)

  const result = db.prepare(countQuery).get(...countQueryParams) as {
    'COUNT(*)': number
  }
  const total = result['COUNT(*)']
  const data = db
    .prepare(query)
    .all(...queryParams) as GoodsItemInfoAll[]

  const parsedData = data.map((item) => {
    try {
      const jsonFields: Array<keyof GoodsItemInfoAll> = [
        'actMaterial',
        'properties',
        'priceDesc',
        'extraInfo',
        'tags',
        'feedTag',
        'preDepositVO',
        'subSkuList',
        'atmosList',
        'merchantInfo',
        'itemAttrs',
        'bannerText',
        'imageList',
        'topSubSku',
        'attrList',
        'itemsDepositVO',
        'shopVO',
        'itemsLikeVO',
        'activityInfoVO',
        'mallRecExpBO',
        'mallHomeExpBO',
        'recExpBO',
        'ipRightList',
        'progressActivityInfoVO',
        'itemsSkuListVO',
        'commitmentTag',
        'headAvDTO',
        'verticalHeadAvDTO',
        'itemsDetailTagVO',
        'ipRoleDTO',
        'itemsVideoVO',
        'floorOrder',
        'addressModuleData',
        'activityTags',
        'itemTags',
        'preSale',
        'remain',
        'presaleStartOrderTime',
        'tagPrefix',
        'advState',
        'blindRotation',
        'img',
        'cateLogicNameList',
        'cateIdList'
      ]

      jsonFields.forEach((field) => {
        if (item[field] && typeof item[field] === 'string') {
          try {
            // @ts-ignore
            item[field] = JSON.parse(item[field])
          } catch (e) {
            console.error(`Error parsing JSON for field ${field} of item ${item.itemsId}:`, e)
            // Optionally, set to null or keep as string if parsing fails
          }
        }
      })
    } catch (e) {
      console.error('Error processing item:', item.itemsId, e)
    }
    return item
  })

  return {
    data: parsedData,
    total,
    page: params.page,
    pageSize: params.pageSize,
  }
}

const baseUrl = 'https://mall.bilibili.com'

// https://mall.bilibili.com/mall-c-search/items/info?itemsId=10178452&shopId=2233

import axios from 'axios'
import { GoodsItemInfo } from '../../../types/goods'
import { updateSearchGoodsItemById } from './sqlite'

/**
 * 根据商品ID和店铺ID获取商品详情并更新数据库
 * @param itemsId 商品ID
 * @param shopId 店铺ID
 * @param cookie 可选的Cookie，用于请求B站接口
 * @returns 更新是否成功
 */
export async function updateGoodsItemDetail({
  itemsId,
  shopId,
}: {
  itemsId: number
  shopId: number
}) {
  try {
    console.log(
      `Fetching goods detail for itemsId: ${itemsId}, shopId: ${shopId}`,
    )

    // 构建请求URL
    const url = `${baseUrl}/mall-c-search/items/info?itemsId=${itemsId}&shopId=${shopId}`

    // 设置请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // 发送请求获取商品详情
    const response = await axios.get(url, { headers })

    // 检查响应状态
    if (response.data.code !== 0) {
      console.error(`Error fetching goods detail: ${response.data.message}`)
      return false
    }

    // 获取商品详情数据
    const goodsItemInfo: GoodsItemInfo = response.data.data

    // 确保商品ID存在
    if (!goodsItemInfo.itemsId) {
      console.error('Invalid goods data: itemsId is missing')
      return false
    }

    // 更新数据库中的商品信息
    const updateResult = updateSearchGoodsItemById(goodsItemInfo)

    console.log(
      `Updated goods detail for itemsId: ${itemsId}, result: ${updateResult}`,
    )
    return updateResult
  } catch (error) {
    console.error('Error updating goods detail:', error)
    return false
  }
}
