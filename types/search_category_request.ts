export interface SearchCategoryRequestBody {
    keyword?: string;
    filters?: string;
    priceFlow?: string;
    priceCeil?: string;
    sortType?: string;
    sortOrder?: string;
    pageIndex?: number;
    userId?: string;
    state?: string;
    scene?: string;
    termQueries?: Array<{ field: string; values: string[] }>;
    rangeQueries?: any[]; // 根据实际情况定义更具体的类型
    extra?: any[]; // 根据实际情况定义更具体的类型
}

export interface SearchCategoryGoodsItem { // 商品列表
    itemsId: number; // 商品ID
    bizType: string; // 业务类型
    itemsType: number; // 商品类型
    name: string; // 商品名称
    price: string; // 商品价格
    itemsImg: string; // 商品图片 URL
    actMaterial: { // 活动素材
        cardBgImg: string; // 卡片背景图片 URL
        rightIconImg: string; // 右侧图标图片 URL
    };
    selfSold: boolean; // 是否自营
    tag: string; // 标签
    marketingTag: string; // 营销标签
    recommendTag: string; // 推荐标签
    soldOut: string; // 是否售罄
    like: number; // 点赞数
    brief: string; // 简介
    properties: string; // 属性
    preDepositPrice: string; // 预售定金价格
    maxPreDepositPrice: string; // 最大预售定金价格
    saleType: number; // 销售类型
    payType: number; // 支付类型
    coin: string; // 硬币
    pricePrefix: string; // 价格前缀
    priceSymbol: string; // 价格符号
    priceDesc: string[]; // 价格描述
    extraInfo: string; // 额外信息
    ipRightName: string; // IP版权名称
    ipRightId: number; // IP版权ID
    brandName: string; // 品牌名称
    brandId: number; // 品牌ID
    presaleDeliveryTimeStr: string | null; // 预售发货时间字符串
    preSale: any | null; // 预售信息，根据实际情况定义更具体的类型
    remain: any | null; // 剩余数量，根据实际情况定义更具体的类型
    presaleStartOrderTime: any | null; // 预售开始订购时间，根据实际情况定义更具体的类型
    tags: { // 标签信息
        promotionTagV2: any | null; // 促销标签V2
        promotionTagNames: any | null; // 促销标签名称
        marketingTagNames: string[]; // 营销标签名称
        saleTypeTagNames: any[]; // 销售类型标签名称
        typeAndLimitTagName: string; // 类型和限制标签名称
        itemTagNames: any[]; // 商品标签名称
        recommendTagNames: any | null; // 推荐标签名称
        attributeTagNames: string[]; // 属性标签名称
        rankAndSellPointTagNames: any | null; // 排名和卖点标签名称
        blindBoxHideTypeNames: any | null; // 盲盒隐藏类型名称
        titleTagNames: string[]; // 标题标签名称
        ticketTag: any | null; // 票务标签
        starBoxSalePoints: string[]; // 星盒卖点
        exclusiveSalePoints: string[]; // 独家销售点，通常为图片URL数组
        otherSalePoints: any[]; // 其他卖点
        serviceTagNames: string[]; // 服务标签名称
        tagsSort: string[]; // 标签排序
        adTagNames: string[]; // 广告标签名称
        serviceRightsTags: any[]; // 服务权益标签
    };
    feedTag: { // Feed标签
        frontTag: Array<{ // 前置标签
            tagType: number; // 标签类型
            backImgUrl: string; // 背景图片 URL
            backImgWidth: number; // 背景图片宽度
            backImgHeight: number; // 背景图片高度
            title: string; // 标题
            cornerRadius: number; // 圆角半径
            useBoard: number; // 是否使用边框
            boardDayColor1: string; // 边框日间颜色1
            boardDayColor2: string; // 边框日间颜色2
            boardNightColor1: string; // 边框夜间颜色1
            boardNightColor2: string; // 边框夜间颜色2
            backDayColor1: string; // 背景日间颜色1
            backDayColor2: string; // 背景日间颜色2
            backNightColor1: string; // 背景夜间颜色1
            backNightColor2: string; // 背景夜间颜色2
            titleDayColor1: string; // 标题日间颜色1
            titleDayColor2: string; // 标题日间颜色2
            titleNightColor1: string; // 标题夜间颜色1
            titleNightColor2: string; // 标题夜间颜色2
            location: string; // 位置
        }>;
        underTag: Array<{ // 后置标签
            tagType: number; // 标签类型
            backImgUrl: string; // 背景图片 URL
            backImgWidth: number; // 背景图片宽度
            backImgHeight: number; // 背景图片高度
            title: string; // 标题
            cornerRadius: number; // 圆角半径
            useBoard: number; // 是否使用边框
            boardDayColor1: string; // 边框日间颜色1
            boardDayColor2: string; // 边框日间颜色2
            boardNightColor1: string; // 边框夜间颜色1
            boardNightColor2: string; // 边框夜间颜色2
            backDayColor1: string; // 背景日间颜色1
            backDayColor2: string; // 背景日间颜色2
            backNightColor1: string; // 背景夜间颜色1
            backNightColor2: string; // 背景夜间颜色2
            titleDayColor1: string; // 标题日间颜色1
            titleDayColor2: string; // 标题日间颜色2
            titleNightColor1: string; // 标题夜间颜色1
            titleNightColor2: string; // 标题夜间颜色2
            location: string; // 位置
        }>;
    };
    tagPrefix: any | null; // 标签前缀
    preDepositVO: any | null; // 预售定金VO
    advState: any | null; // 广告状态
    subSkuList: any | null; // 子SKU列表
    atmosList: (any | null)[]; // Atmos列表
    jumpUrl: string; // 跳转 URL
    jumpUrlH5: string; // H5跳转 URL
    jumpLinkType: number; // 跳转链接类型
    themeId: number; // 主题ID
    pubtime: number; // 发布时间
    blindRotation: any | null; // 盲盒旋转
    living: boolean; // 是否直播中
    merchantInfo: any | null; // 商户信息
    itemAttrs: any | null; // 商品属性
    bannerText: string; // Banner文本
    type: string; // 类型
    interest: string; // 兴趣
    imageList: any | null; // 图片列表
    topSubSku: any | null; // 顶部子SKU
    isNewCustom: boolean; // 是否新用户
    blindCardUrl: string; // 盲盒卡片 URL
}

/**
 * 搜索分类接口响应
 */
export interface SearchCategoryResponse {
    code: number; // 响应码
    message: string; // 响应消息
    errtag: number; // 错误标签
    data: { // 响应数据

        pageNum: number; // 当前页码
        pageSize: number; // 每页大小
        numResults: number; // 总结果数
        pageTitle: string; // 页面标题
        pageIndex: number; // 当前页索引
        lastPage: number; // 最后一页
        firstPage: number; // 第一页
        hasPreviousPage: boolean; // 是否有上一页
        soldOutNum: number; // 售罄数量
        cardActive: boolean; // 卡片是否激活
        card: { // 卡片信息
            isSubscribed: number; // 是否已订阅
            id: string; // ID
            hotPower: number; // 热度
            ipId: number; // IP ID
            subscribedNum: number; // 订阅数量
            type: string; // 类型
            logo: string; // Logo URL
            banner: string; // Banner URL
            cover: string; // 封面 URL
            title: string; // 标题
            zhTitle: string; // 中文标题
            alias: string; // 别名
            desc: string; // 描述
            rank_score: number; // 排名分数
            itemsNum: number; // 商品数量
            jumpUrl: string; // 跳转 URL
        };
        banner: any | null; // Banner信息，根据实际情况定义更具体的类型
        hasNextPage: boolean; // 是否有下一页
        redirectUrl: string; // 重定向 URL
        list: Array<SearchCategoryGoodsItem>;
        isRecommend: boolean; // 是否推荐
        recommendList: any | null; // 推荐列表
        searchFilter: any | null; // 搜索过滤器
        seid: string; // SEID
        traceId: string; // 追踪ID
        queryId: string; // 查询ID
        suggestKeyword: any | null; // 建议关键词
        querySearch?: { // 查询搜索
            type?: string; // 类型
            title?: string; // 标题
            filterList?: Array<{ // 过滤列表
                id?: string; // ID
                name?: string; // 名称
                type?: string; // 类型
                value?: string; // 值
                subList?: Array<any>; // 子列表
            }>;
        };
        attrFilter?: { // 属性过滤器
            interval?: number; // 间隔
            filters?: Array<{ // 过滤器列表
                id?: string; // ID
                name?: string; // 名称
                type?: string; // 类型
                value?: string; // 值
                subList?: Array<any>; // 子列表
            }>;
        };
        recPopup?: any | null; // 推荐弹窗
        mhTabAb?: string; // MH Tab AB
        wordCard?: any | null; // 词卡
    };
}