import axios from 'axios';
import { omit } from 'es-toolkit'

import { SearchCategoryRequestBody, SearchCategoryResponse, SearchCategoryGoodsItem } from '../../../types/search_category_request';
import { insertSearchGoodsItems } from './sqlite';

const baseUrl = 'https://mall.bilibili.com';

export async function searchCategoryV2(requestBody: SearchCategoryRequestBody & { cookieStr: string }) {
    try {
        const response = await axios.post(`${baseUrl}/mall/noah/search/category/v2`, omit(requestBody, ['cookieStr']), {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': requestBody.cookieStr
            }
        });
        const GoodsList: SearchCategoryGoodsItem[] = response.data?.data?.list || []
        console.log('searchCategoryV2 -> GoodsList.length -> ', GoodsList.length)
        if (GoodsList.length > 0) {
            try {
                insertSearchGoodsItems(GoodsList);
            } catch (err) {
                console.error(err)
            }
        }
        return response.data as SearchCategoryResponse;
    } catch (error) {
        console.error('Error searching category v2:', error);
        throw error;
    }
}