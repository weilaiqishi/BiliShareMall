import { Request, Response } from 'express';
import { searchGoodsItems, SearchGoodsItemsParams } from '../services/goods';

export const searchGoods = (req: Request, res: Response) => {
    try {
        const params: SearchGoodsItemsParams = {
            name: req.query.name as string | undefined,
            priceFlow: req.query.priceFlow ? Number(req.query.priceFlow) : undefined,
            priceCeil: req.query.priceCeil ? Number(req.query.priceCeil) : undefined,
            page: req.query.page ? Number(req.query.page) : 1,
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20
        };
        
        const result = searchGoodsItems(params);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || '查询商品失败' });
    }
};