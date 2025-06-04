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