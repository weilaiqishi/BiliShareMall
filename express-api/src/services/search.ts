import axios from 'axios';
import { omit } from 'es-toolkit'

import { SearchCategoryRequestBody } from '@types/types/search_category_request';

const baseUrl = 'https://mall.bilibili.com';

export async function searchCategoryV2(requestBody: SearchCategoryRequestBody & { cookieStr: string }) {
    try {
        const response = await axios.post(`${baseUrl}/mall/noah/search/category/v2`, omit(requestBody, ['cookieStr']), {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': requestBody.cookieStr
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching category v2:', error);
        throw error;
    }
}