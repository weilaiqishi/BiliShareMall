// ... existing code ...
import { SearchCategoryGoodsItem } from '../../../types/search_category_request'
import { db } from './sqlite' // 导入 db 实例

export interface SearchGoodsItemsParams {
  name?: string
  priceFlow?: number
  priceCeil?: number
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export function searchGoodsItems(
  params: SearchGoodsItemsParams,
): PaginatedResult<SearchCategoryGoodsItem> {
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
    .all(...queryParams) as SearchCategoryGoodsItem[]

  const parsedData = data.map((item) => {
    try {
      if (item.actMaterial && typeof item.actMaterial === 'string') {
        item.actMaterial = JSON.parse(item.actMaterial)
      }
      if (item.properties && typeof item.properties === 'string') {
        item.properties = JSON.parse(item.properties)
      }
      if (item.priceDesc && typeof item.priceDesc === 'string') {
        item.priceDesc = JSON.parse(item.priceDesc)
      }
      if (item.extraInfo && typeof item.extraInfo === 'string') {
        item.extraInfo = JSON.parse(item.extraInfo)
      }
      if (item.tags && typeof item.tags === 'string') {
        item.tags = JSON.parse(item.tags)
      }
      if (item.feedTag && typeof item.feedTag === 'string') {
        item.feedTag = JSON.parse(item.feedTag)
      }
      if (item.preDepositVO && typeof item.preDepositVO === 'string') {
        item.preDepositVO = JSON.parse(item.preDepositVO)
      }
      if (item.subSkuList && typeof item.subSkuList === 'string') {
        item.subSkuList = JSON.parse(item.subSkuList)
      }
      if (item.atmosList && typeof item.atmosList === 'string') {
        item.atmosList = JSON.parse(item.atmosList)
      }
      if (item.merchantInfo && typeof item.merchantInfo === 'string') {
        item.merchantInfo = JSON.parse(item.merchantInfo)
      }
      if (item.itemAttrs && typeof item.itemAttrs === 'string') {
        item.itemAttrs = JSON.parse(item.itemAttrs)
      }
      if (item.bannerText && typeof item.bannerText === 'string') {
        item.bannerText = JSON.parse(item.bannerText)
      }
      if (item.imageList && typeof item.imageList === 'string') {
        item.imageList = JSON.parse(item.imageList)
      }
      if (item.topSubSku && typeof item.topSubSku === 'string') {
        item.topSubSku = JSON.parse(item.topSubSku)
      }
    } catch (e) {
      console.error('Error parsing JSON for item:', item.itemsId, e)
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
