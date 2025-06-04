import { Request, Response } from 'express';
import { searchCategoryV2 } from '../services/search';
import { SearchCategoryRequestBody } from '@types/search_category_request';

export const searchCategory = async (req: Request<any, any, SearchCategoryRequestBody & { cookieStr: string; }>, res: Response) => {
    try {
        const result = await searchCategoryV2(req.body);
        res.json(result);
    } catch (error) {
        console.error('searchCategory error -> ', error);
        res.status(500).json({ error: '搜索分类失败' });
    }
};