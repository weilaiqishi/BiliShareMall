export interface SearchCategoryRequestBody {
  keyword?: string
  filters?: string
  priceFlow?: string
  priceCeil?: string
  sortType?: string
  sortOrder?: string
  pageIndex?: number
  userId?: string
  state?: string
  scene?: string
  termQueries?: Array<{ field: string; values: string[] }>
  rangeQueries?: any[] // 根据实际情况定义更具体的类型
  extra?: any[] // 根据实际情况定义更具体的类型
}

export interface SearchCategoryGoodsItem {
  // 商品列表
  itemsId: number // 商品ID
  bizType: string // 业务类型
  itemsType: number // 商品类型
  name: string // 商品名称
  price: string // 商品价格
  itemsImg: string // 商品图片 URL
  actMaterial: any // 活动素材
  selfSold: boolean // 是否自营
  tag: string // 标签
  marketingTag: string // 营销标签
  recommendTag: string // 推荐标签
  soldOut: string // 是否售罄
  like: number // 点赞数
  brief: string // 简介
  properties: any // 属性
  preDepositPrice: string // 预售定金价格
  maxPreDepositPrice: string // 最大预售定金价格
  saleType: number // 销售类型
  payType: number // 支付类型
  coin: string // 硬币
  pricePrefix: string // 价格前缀
  priceSymbol: string // 价格符号
  priceDesc: any // 价格描述
  extraInfo: any // 额外信息
  ipRightName: string // IP版权名称
  ipRightId: number // IP版权ID
  brandName: string // 品牌名称
  brandId: number // 品牌ID
  presaleDeliveryTimeStr: string | null // 预售发货时间字符串
  preSale: any | null // 预售信息，根据实际情况定义更具体的类型
  remain: any | null // 剩余数量，根据实际情况定义更具体的类型
  presaleStartOrderTime: any | null // 预售开始订购时间，根据实际情况定义更具体的类型
  tags: any // 标签信息
  feedTag: any // Feed标签
  tagPrefix: any | null // 标签前缀
  preDepositVO: any // 预售定金VO
  advState: any | null // 广告状态
  subSkuList: any // 子SKU列表
  atmosList: any // Atmos列表
  jumpUrl: string // 跳转 URL
  jumpUrlH5: string // H5跳转 URL
  jumpLinkType: number // 跳转链接类型
  themeId: number // 主题ID
  pubtime: number // 发布时间
  blindRotation: any | null // 盲盒旋转
  living: boolean // 是否直播中
  merchantInfo: any // 商户信息
  itemAttrs: any // 商品属性
  bannerText: any // Banner文本
  type: string // 类型
  interest: string // 兴趣
  imageList: any // 图片列表
  topSubSku: any // 顶部子SKU
  isNewCustom: boolean // 是否新用户
  blindCardUrl: string // 盲盒卡片 URL
}

/**
 * 搜索分类接口响应
 */
export interface SearchCategoryResponse {
  code: number // 响应码
  message: string // 响应消息
  errtag: number // 错误标签
  data: {
    // 响应数据

    pageNum: number // 当前页码
    pageSize: number // 每页大小
    numResults: number // 总结果数
    pageTitle: string // 页面标题
    pageIndex: number // 当前页索引
    lastPage: number // 最后一页
    firstPage: number // 第一页
    hasPreviousPage: boolean // 是否有上一页
    soldOutNum: number // 售罄数量
    cardActive: boolean // 卡片是否激活
    card: {
      // 卡片信息
      isSubscribed: number // 是否已订阅
      id: string // ID
      hotPower: number // 热度
      ipId: number // IP ID
      subscribedNum: number // 订阅数量
      type: string // 类型
      logo: string // Logo URL
      banner: string // Banner URL
      cover: string // 封面 URL
      title: string // 标题
      zhTitle: string // 中文标题
      alias: string // 别名
      desc: string // 描述
      rank_score: number // 排名分数
      itemsNum: number // 商品数量
      jumpUrl: string // 跳转 URL
    }
    banner: any | null // Banner信息，根据实际情况定义更具体的类型
    hasNextPage: boolean // 是否有下一页
    redirectUrl: string // 重定向 URL
    list: Array<SearchCategoryGoodsItem>
    isRecommend: boolean // 是否推荐
    recommendList: any | null // 推荐列表
    searchFilter: any | null // 搜索过滤器
    seid: string // SEID
    traceId: string // 追踪ID
    queryId: string // 查询ID
    suggestKeyword: any | null // 建议关键词
    querySearch?: {
      // 查询搜索
      type?: string // 类型
      title?: string // 标题
      filterList?: Array<{
        // 过滤列表
        id?: string // ID
        name?: string // 名称
        type?: string // 类型
        value?: string // 值
        subList?: Array<any> // 子列表
      }>
    }
    attrFilter?: {
      // 属性过滤器
      interval?: number // 间隔
      filters?: Array<{
        // 过滤器列表
        id?: string // ID
        name?: string // 名称
        type?: string // 类型
        value?: string // 值
        subList?: Array<any> // 子列表
      }>
    }
    recPopup?: any | null // 推荐弹窗
    mhTabAb?: string // MH Tab AB
    wordCard?: any | null // 词卡
  }
}

export interface SearchGoodsItemsParams {
  name?: string
  priceFlow?: number
  priceCeil?: number
  page: number
  pageSize: number
}

export interface GoodsItemInfo {
  // 商品ID
  itemsId: number
  // 是否自营
  selfSold: boolean
  // 商品名称
  name: string
  // 店铺ID
  shopId: number
  // 商品图片列表
  img: string[]
  // 商品价格
  price: string
  // 品牌ID
  brandId: number
  // 品牌名称
  brandName: string
  // 品牌Logo
  brandLogo: string
  // 品牌跳转链接
  brandJumpUrl: string
  // 品牌总评分
  brandTotalScore: string
  // 移动端商品描述（HTML格式）
  mobileDesc: string
  // PC端商品描述
  pcDesc: string
  // 商品状态
  status: number
  // 商品项状态
  itemsStatus: number
  // 销售状态
  saleStatus: number
  // 销售类型
  saleType: number
  // 子销售类型
  subSaleType: number
  // 商品类型
  itemsType: string
  // 商品子类型
  itemsSubType: string
  // 是否为单SKU商品
  isSingleSku: boolean
  // 购物车数量
  cartCount: number
  // 活动标签
  activityTags: string
  // 属性列表
  attrList: Array<{
    // 属性名称
    attrName: string
    // 属性值
    attrValue: string | string[]
  }>
  // 商品定金信息
  itemsDepositVO: {
    // 定金类型
    depositType: number
    // 定金金额
    deposit: number
    // 定金价格字符串
    depositPrice: string
    // SKU ID
    skuId: number
    // 价格
    price: string
    // 库存
    stock: number
    // 警告库存
    warnStock: number
    // 库存级别
    stockLevel: number
    // 图片
    img: string
    // 预售定金价格
    preDepositPrice: string
    // 是否限购
    limitBuy: boolean
    // 活动价格
    activityPrice: null
    // 活动定金价格
    activityDepositPrice: null
    // 活动库存
    activityStock: null
    // 活动限制
    activityRestriction: null
    // 冻结库存
    frozenStock: number
    // 现货库存
    zpEntityStock: number
    // 税费
    tax: number
    // 税率
    taxRate: number
    // 状态
    status: number
    // 子状态
    subStatus: number
    // 自动上架时间
    autoOnSaleTime: number
    // 是否异步SKU
    asyncSku: boolean
  }
  // 店铺信息
  shopVO: {
    // 店铺ID
    shopId: number
    // 店铺名称
    shopName: string
    // 店铺Logo
    logo: string
    // 计数
    count: number
    // 关注状态
    followState: number
    // 店主ID
    shopOwnerId: number
    // 客服链接
    customerLinks: string
    // iOS客服链接
    iosCustomerLink: null
    // Android客服链接
    androidCustomerLink: null
    // 购买销售模式
    purchaseSaleMode: null
    // 营业执照URL
    businessLicenseUrl: null
  }
  // 商品点赞信息
  itemsLikeVO: {
    // 是否已点赞
    hasLiked: boolean
    // 点赞数量
    count: number
    // 点赞用户头像列表
    users: string[]
    // 点赞用户VO列表
    userVOS: Array<{
      // 用户ID
      mid: number
      // 用户头像
      avator: string
    }>
  }
  // 活动信息
  activityInfoVO: {
    // 活动ID
    activityId: number
    // 显示标签
    showLabel: string
    // 显示标签文本
    showLabelText: null
    // 类型
    type: number
    // 开始时间
    startTime: null
    // 结束时间
    endTime: null
    // 发布时间
    publishTime: null
    // 倒计时时间
    countdownTime: null
    // 服务器时间
    serverTime: null
    // 活动销售状态
    activitySaleStatus: null
    // 活动状态
    activityStatus: null
    // 是否所有SKU都参与
    isAllSku: null
    // 新用户
    newCustomer: null
    // 减少价格
    reducedPrice: null
    // 使用优惠券后的减少价格
    reducedPriceUsedCoupon: null
    // 优惠券列表
    couponList: Array<{
      // 优惠券ID
      couponId: string
      // 优惠券类型
      couponType: number
      // 优惠券标签
      couponTag: null
      // 优惠券名称
      couponName: string
      // 显示名称
      showName: string
      // 店铺标签
      shopLabel: string
      // 优惠券类型描述
      couponTypeDesc: string
      // 使用效果单位
      useEffectUnit: number
      // 折扣
      discount: string
      // 折扣Y
      discountY: number
      // 使用效果天数
      useEffectDays: number
      // 使用开始时间
      useStartTime: number
      // 使用结束时间
      useEndTime: number
      // 新用户限制
      newUserLimit: number
      // 来源ID
      sourceId: string
      // 来源权限ID
      sourceAuthorityId: string
      // 是否独占
      isExclusive: boolean
      // 优惠券状态
      couponStatus: null
      // 优惠券状态信息
      couponStatusMsg: null
      // 场景信息列表
      sceneInfoList: Array<{
        // 父场景ID
        parentSceneId: number
        // 场景ID
        sceneId: number
      }>
    }>
    // 预类型
    preType: null
    // 是否在白名单中
    isInWhiteList: null
    // 白名单绑定信息
    whiteBindInfo: null
  }
  // 店铺模式
  shopMode: number
  // 图片比例
  imgScale: string
  // 税费
  tax: number
  // 最大税费
  maxTax: number
  // 税率
  taxRate: number
  // 限制
  restriction: number
  // 每单限制
  restrictionPerOrder: number
  // 客服链接
  customerLinks: string
  // 预售发货时间字符串
  presaleDeliveryTimeStr: string
  // 是否显示
  isShow: number
  // 自动上架时间
  autoOnSaleTime: number
  // 服务器时间
  serverTime: number
  // 是否隐藏规格
  isSpecHide: number
  // 商城推荐实验BO
  mallRecExpBO: {
    // 天马命中实验
    tianMaHitExp: boolean
    // 搜索命中实验
    searchHitExp: boolean
    // 保留实验
    retainExp: boolean
    // 保留老客户到索引实验
    retainOldCustomer2IndexExp: boolean
    // 引导栏实验
    guideBarExp: boolean
  }
  // 商城首页实验BO
  mallHomeExpBO: {
    // 是否显示一体卡
    canShowAllInOneCard: boolean
    // 命中合并商品详情页
    hitMergeItemsDetailPage: boolean
  }
  // 推荐实验BO
  recExpBO: {
    // 是否需要风险图片
    needRiskImg: boolean
    // 命中合并商品详情页
    hitMergeItemsDetailPage: boolean
  }
  // IP权益列表
  ipRightList: Array<{
    // IP权益ID
    ipRightId: string
    // IP权益名称
    ipRightName: string
    // IP权益Logo
    ipRightLogo: string
    // 跳转链接
    jumpUrl: string
    // NA跳转链接
    naJumpUrl: string
    // 前缀
    prefix: null
    // 标题
    title: null
    // 权益信息
    benefitInfo: null
    // 是否显示
    isShow: boolean
  }>
  // UGC总数
  ugcTotalCount: number
  // 评论状态
  commentStatus: number
  // 是否显示IP活动
  isShowIpActivity: boolean
  // 是否可加入购物车
  canAddCart: number
  // 进度活动信息VO
  progressActivityInfoVO: Array<{
    // 活动ID
    activityId: string
    // 类型
    type: number
    // 活动名称
    activityName: string
    // 描述
    description: string
    // 全文
    fullText: null
    // 跳转链接
    jumpUrl: string
    // 模态文本
    modalText: null
  }>
  // 商品SKU列表VO
  itemsSkuListVO: {
    // 商品ID
    itemsId: number
    // 规格列表
    specs: string[]
    // 商品SKU列表
    itemsSkuList: Array<{
      // ID
      id: number
      // 课程ID
      lessonId: number
      // 价格
      price: string
      // 库存
      stock: number
      // 警告库存
      warnStock: number
      // 库存级别
      stockLevel: number
      // 图片
      img: string
      // 规格值
      specValues: string[]
      // 定金
      deposit: string
      // 预售定金价格
      preDepositPrice: string
      // 限购
      limitBuy: boolean
      // 活动价格
      activityPrice: null
      // 活动定金
      activityDeposit: null
      // 活动库存
      activityStock: null
      // 活动限制
      activityRestriction: null
      // 活动销售状态
      activitySaleStatus: null
      // 活动类型
      activityType: null
      // 状态
      status: number
      // 子状态
      subStatus: number
      // 是否显示
      isShow: number
      // 自动上架时间
      autoOnSaleTime: number
      // 参考价格
      referencePrice: string
      // 销售类型
      saleType: number
      // 白名单SKU
      whiteListSku: null
      // 划线价格
      linePrice: null
      // SKU标签VO
      skuTagVO: null
      // 规格值ID
      specValueId: null
      // 是否可加入购物车
      canAddCart: number
      // 异步SKU
      asyncSku: boolean
      // 商品步骤
      itemsStep: null
    }>
    // 规格信息列表
    specInfoList: Array<{
      // 规格ID
      specId: number
      // 规格名称
      specName: string
      // 规格值VO列表
      specValueVOList: Array<{
        // 规格ID
        specId: number
        // 规格值名称
        specValueName: string
        // 规格值图片
        specValueImg: string
      }>
    }>
    // 第一个规格数量
    firstSpecNum: number
    // 是否有规格值图片
    hasSpecValueImg: boolean
    // SKU面板URL
    skuPanelUrl: null
  }
  // 跳转链接类型
  jumpLinkType: number
  // 是否热门商品
  isHotItem: number
  // H5客服链接
  h5CustomerLinks: string
  // 承诺标签
  commitmentTag: Array<{
    // 类型
    type: string
    // 名称
    name: string
    // 样式
    style: number
  }>
  // 品牌提供图片
  brandProvidedPicture: number
  // 头部视频来源
  headAvFrom: null
  // 头部视频DTO
  headAvDTO: {
    // 视频ID列表
    videoIds: null
    // 长视频ID列表
    longVideoIds: string[]
    // 视频URL列表
    videoUrls: string[]
    // 视频类型
    videoType: number
  }
  // 垂直头部视频DTO
  verticalHeadAvDTO: {
    // 视频ID列表
    videoIds: null
    // 长视频ID列表
    longVideoIds: string[]
    // 视频URL列表
    videoUrls: string[]
    // 视频类型
    videoType: null
  }
  // 商品标签
  itemTags: null
  // 商品详情标签VO
  itemsDetailTagVO: {
    // 顶部标签模式
    topTagMode: number
  }
  // IP角色DTO
  ipRoleDTO: {
    // IP角色ID
    ipRoleId: number
    // Logo
    logo: string
    // 对话
    dialogues: string
  }
  // 商品视频VO
  itemsVideoVO: {
    // 首帧图片
    firstFrameImg: string
  }
  // 楼层顺序
  floorOrder: {
    // 属性
    attr: number
  }
  // 页面类型
  pageType: string
  // 分类逻辑名称列表
  cateLogicNameList: string[]
  // 分类ID
  cateId: number
  // 分类ID列表
  cateIdList: number[]
  // 是否显示推荐模型
  showRecommendModel: boolean
  // 地址模块数据
  addressModuleData: {
    // 是否显示
    isShow: boolean
    // 发货时间（小时）
    deliveryTimeHours: number
    // 仓库
    storehouse: number
  }
  // 是否闪购
  isFlash: number
  // 销量
  sales: number
  // 新订单信息
  newOrderInfo: number
  // 引导索引URL
  guideIndexUrl: string
  // 保留天数频率
  retainDaysFreq: number
}

export type GoodsItemInfoAll = GoodsItemInfo & SearchCategoryGoodsItem