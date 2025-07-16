import Database from 'better-sqlite3'
import path from 'path'

import { SearchCategoryGoodsItem, GoodsItemInfo } from '../../../types/goods'

const dbPath = path.join(__dirname, '../../../data/bsm.db')
export let db: Database.Database

// 定义表结构字段
const tableFields = {
  scrapyItems: {
    ID: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    Name: 'TEXT',
    Cookie: 'TEXT',
    NextToken: 'INTEGER',
    Status: 'INTEGER',
    CreateTime: 'INTEGER',
    UpdateTime: 'INTEGER',
    searchParams: 'TEXT',
  },
  search_goods_items: {
    itemsId: 'INTEGER PRIMARY KEY UNIQUE',
    bizType: 'TEXT',
    itemsType: 'INTEGER',
    name: 'TEXT',
    price: 'TEXT',
    itemsImg: 'TEXT',
    actMaterial: 'TEXT',
    selfSold: 'BOOLEAN',
    tag: 'TEXT',
    marketingTag: 'TEXT',
    recommendTag: 'TEXT',
    soldOut: 'TEXT',
    like: 'INTEGER',
    brief: 'TEXT',
    properties: 'TEXT',
    preDepositPrice: 'TEXT',
    maxPreDepositPrice: 'TEXT',
    saleType: 'INTEGER',
    payType: 'INTEGER',
    coin: 'TEXT',
    pricePrefix: 'TEXT',
    priceSymbol: 'TEXT',
    priceDesc: 'TEXT',
    extraInfo: 'TEXT',
    ipRightName: 'TEXT',
    ipRightId: 'INTEGER',
    brandName: 'TEXT',
    brandId: 'INTEGER',
    presaleDeliveryTimeStr: 'TEXT',
    preSale: 'TEXT',
    remain: 'TEXT',
    presaleStartOrderTime: 'TEXT',
    tags: 'TEXT',
    feedTag: 'TEXT',
    tagPrefix: 'TEXT',
    preDepositVO: 'TEXT',
    advState: 'TEXT',
    subSkuList: 'TEXT',
    atmosList: 'TEXT',
    jumpUrl: 'TEXT',
    jumpUrlH5: 'TEXT',
    jumpLinkType: 'INTEGER',
    themeId: 'INTEGER',
    pubtime: 'INTEGER',
    blindRotation: 'TEXT',
    living: 'BOOLEAN',
    merchantInfo: 'TEXT',
    itemAttrs: 'TEXT',
    bannerText: 'TEXT',
    type: 'TEXT',
    interest: 'TEXT',
    imageList: 'TEXT',
    topSubSku: 'TEXT',
    isNewCustom: 'BOOLEAN',
    blindCardUrl: 'TEXT',
    // 从 GoodsItemInfo 添加的商品详情字段
    shopId: 'INTEGER',
    img: 'TEXT',
    brandLogo: 'TEXT',
    brandJumpUrl: 'TEXT',
    brandTotalScore: 'TEXT',
    mobileDesc: 'TEXT',
    pcDesc: 'TEXT',
    status: 'INTEGER',
    itemsStatus: 'INTEGER',
    saleStatus: 'INTEGER',
    subSaleType: 'INTEGER',
    itemsSubType: 'TEXT',
    isSingleSku: 'BOOLEAN',
    cartCount: 'INTEGER',
    activityTags: 'TEXT',
    attrList: 'TEXT',
    itemsDepositVO: 'TEXT',
    shopVO: 'TEXT',
    itemsLikeVO: 'TEXT',
    activityInfoVO: 'TEXT',
    shopMode: 'INTEGER',
    imgScale: 'TEXT',
    tax: 'INTEGER',
    maxTax: 'INTEGER',
    taxRate: 'INTEGER',
    restriction: 'INTEGER',
    restrictionPerOrder: 'INTEGER',
    customerLinks: 'TEXT',
    isShow: 'INTEGER',
    autoOnSaleTime: 'INTEGER',
    serverTime: 'INTEGER',
    isSpecHide: 'INTEGER',
    mallRecExpBO: 'TEXT',
    mallHomeExpBO: 'TEXT',
    recExpBO: 'TEXT',
    ipRightList: 'TEXT',
    ugcTotalCount: 'INTEGER',
    commentStatus: 'INTEGER',
    isShowIpActivity: 'BOOLEAN',
    canAddCart: 'INTEGER',
    progressActivityInfoVO: 'TEXT',
    itemsSkuListVO: 'TEXT',
    isHotItem: 'INTEGER',
    h5CustomerLinks: 'TEXT',
    commitmentTag: 'TEXT',
    brandProvidedPicture: 'INTEGER',
    headAvFrom: 'TEXT',
    headAvDTO: 'TEXT',
    verticalHeadAvDTO: 'TEXT',
    itemTags: 'TEXT',
    itemsDetailTagVO: 'TEXT',
    ipRoleDTO: 'TEXT',
    itemsVideoVO: 'TEXT',
    floorOrder: 'TEXT',
    pageType: 'TEXT',
    cateLogicNameList: 'TEXT',
    cateId: 'INTEGER',
    cateIdList: 'TEXT',
    showRecommendModel: 'BOOLEAN',
    addressModuleData: 'TEXT',
    isFlash: 'INTEGER',
    sales: 'INTEGER',
    newOrderInfo: 'INTEGER',
    guideIndexUrl: 'TEXT',
    retainDaysFreq: 'INTEGER',
    create_time: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
    update_time: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
  },
}

/**
 * 将表字段对象转换为 SQL 创建表语句
 * @param tableName 表名
 * @param fields 字段定义对象
 * @returns SQL 创建表语句
 */
function generateCreateTableSQL(
  tableName: string,
  fields: Record<string, string>,
): string {
  const fieldDefinitions = Object.entries(fields)
    .map(([fieldName, fieldType]) => `${fieldName} ${fieldType}`,)
    .join(',\n')
  return `CREATE TABLE IF NOT EXISTS ${tableName} (${fieldDefinitions});`
}

export function initializeDatabase() {
  try {
    db = new Database(dbPath, { verbose: console.log })
    console.log('Connected to the SQLite database.')

    // 使用对象字段拼接创建表
    const createTablesSQL = Object.entries(tableFields)
      .map(([tableName, fields]) => generateCreateTableSQL(tableName, fields))
      .join('\n')

    // 创建表
    db.exec(createTablesSQL)
    console.log('SQLite tables checked/created.')
  } catch (error) {
    console.error('Error connecting to SQLite or creating tables:', error)
    throw error
  }
}

/**
 * 插入或更新商品数据
 * @param items 商品数据数组
 */
export function insertSearchGoodsItems(items: SearchCategoryGoodsItem[]) {
  const keys = Object.keys(tableFields.search_goods_items).filter(
    (key) => key !== 'update_time',
  )
  console.log('insertSearchGoodsItems', items.length)
  const stmt = db.prepare(`
        INSERT OR REPLACE INTO search_goods_items (
            ${keys.join(',')}
        ) VALUES (
            ${keys.map(() => '?').join(',')}
        )
    `)

  for (const item of items) {
    const values = keys.map(key => {
      // 如果是 SearchCategoryGoodsItem 中的字段
      if (key in item) {
        const value = item[key as keyof typeof item]
        
        // 处理布尔值和复杂对象
        if (typeof value === 'boolean') {
          return value ? 1 : 0
        } else if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value)
        }
        return value
      }
      // 如果不是 SearchCategoryGoodsItem 中的字段，返回 null
      return null
    })

    stmt.run(...values)
  }
}

/**
 * 按 itemsId 更新商品数据
 * @param item 商品数据
 * @returns 更新是否成功
 */
export function updateSearchGoodsItemById(item: Partial<SearchCategoryGoodsItem | GoodsItemInfo> & { itemsId: number }) {
  // 确保有 itemsId
  if (!item.itemsId) {
    console.error('updateSearchGoodsItemById: itemsId is required')
    return false
  }

  try {
    // 获取要更新的字段（排除 itemsId 和 update_time，因为 itemsId 是主键，update_time 会自动更新）
    const updateFields = Object.keys(item).filter(
      (key) => key !== 'itemsId' && key !== 'update_time' && key in tableFields.search_goods_items
    )

    if (updateFields.length === 0) {
      console.warn('updateSearchGoodsItemById: No valid fields to update')
      return false
    }

    // 构建 UPDATE 语句
    const updateSQL = `
      UPDATE search_goods_items 
      SET ${updateFields.map(field => `${field} = ?`).join(', ')},
          update_time = CURRENT_TIMESTAMP
      WHERE itemsId = ?
    `

    // 准备参数值数组
    const params = updateFields.map(field => {
      const value = item[field as keyof typeof item]
      
      // 处理布尔值和复杂对象
      if (typeof value === 'boolean') {
        return value ? 1 : 0
      } else if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value)
      }
      return value
    })

    // 添加 WHERE 条件的参数
    params.push(item.itemsId)

    // 执行更新
    const stmt = db.prepare(updateSQL)
    const result = stmt.run(...params)

    console.log(`Updated item ${item.itemsId}, changes: ${result.changes}`)
    return result.changes > 0
  } catch (error) {
    console.error('Error updating search goods item:', error)
    return false
  }
}

export function closeDatabase() {
  if (db) {
    db.close()
    console.log('Closed the SQLite database connection.')
  }
}
