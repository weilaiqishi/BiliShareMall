import Database from 'better-sqlite3';
import path from 'path';
import axios from 'axios';
import { omit, pick } from 'es-toolkit';

import { SearchCategoryRequestBody, SearchCategoryGoodsItem } from '../../../types/search_category_request';
import { ScrapyItem } from '../../../types/scrapy';
import { insertSearchGoodsItems } from './sqlite';

const dbPath = path.join(__dirname, '../../../data/bsm.db');
const db = new Database(dbPath); // 确保 db 实例已连接

const baseUrl = 'https://mall.bilibili.com';

// ScrapyItem 数据库操作
export const createScrapyItem = (params: { Name: string, Cookie: string, searchParams: SearchCategoryRequestBody }) => {
    const stmt = db.prepare(`
        INSERT INTO scrapyItems (
            Name, Cookie, NextToken, Status, CreateTime, UpdateTime, searchParams
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
        params.Name,
        params.Cookie,
        1, // NextToken 初始值
        0, // Status 初始值
        Date.now(), // CreateTime
        Date.now(), // UpdateTime
        JSON.stringify(params.searchParams)
    );
    return info.lastInsertRowid;
};

export const readAllScrapyItems = (): ScrapyItem[] => {
    const stmt = db.prepare('SELECT * FROM scrapyItems');
    const rows = stmt.all() as any[];
    return rows.map(row => ({
        ...row,
        searchParams: JSON.parse(row.searchParams)
    })) as ScrapyItem[];
};

export const readScrapyItem = (id: number): ScrapyItem | undefined => {
    const stmt = db.prepare('SELECT * FROM scrapyItems WHERE ID = ?');
    const row = stmt.get(id) as any;
    if (row) {
        return {
            ...row,
            searchParams: JSON.parse(row.searchParams)
        } as ScrapyItem;
    }
    return undefined;
};

export const updateScrapyItem = (item: ScrapyItem) => {
    const stmt = db.prepare(`
        UPDATE scrapyItems
        SET NextToken = ?, Status = ?, UpdateTime = ?
        WHERE ID = ?
    `);
    const info = stmt.run(
        item.NextToken,
        item.Status,
        Date.now(),
        item.ID
    );
    return info.changes;
};

export const deleteScrapyItem = (id: number) => {
    const stmt = db.prepare('DELETE FROM scrapyItems WHERE ID = ?');
    const info = stmt.run(id);
    return info.changes;
};


let abortControllers: Map<number, AbortController> = new Map();

export const scrapyLoop = async (taskId: number, cookie: string) => {
    const abortController = new AbortController();
    abortControllers.set(taskId, abortController);
    const signal = abortController.signal;

    try {
        let item = readScrapyItem(taskId);
        if (!item) {
            console.error(`Scrapy item not found. -> taskId -> `, taskId);
            return;
        }

        // Update status to running before starting the loop
        item.Status = 1;
        updateScrapyItem(item);

        while (!signal.aborted) {
            console.log(`Running scrapy task -> ID, NextToken -> `, item.ID, item.NextToken);
            const success = await scrapyTask(item, cookie, signal);
            if (!success) {
                console.log(`Scrapy task failed or stopped. -> taskId -> `, taskId);
                break;
            }

            item = readScrapyItem(taskId); // 重新读取以获取最新状态
            if (!item) {
                console.error(`Scrapy item disappeared. -> taskId -> `, taskId);
                break;
            }

            // 模拟 Go 版本的延迟，防止风控
            // 模拟 Go 版本的延迟，防止风控，增加随机因子
            const delay = 5000 + Math.random() * 5000; // 5到7秒延迟
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log(`Scrapy task cancelled. -> taskId -> `, taskId);
        } else {
            let err = error
            if (axios.isAxiosError(err)) {
                err = err.response
            }
            console.error(`Error in scrapyLoop -> taskId -> `, taskId, err);
        }
    } finally {
        abortControllers.delete(taskId);
        let item = readScrapyItem(taskId);
        if (item) {
            item.Status = 0; // 设置为停止
            updateScrapyItem(item);
        }
        if (currentRunningTaskId === taskId) {
            currentRunningTaskId = null; // 任务结束，重置当前运行任务ID
        }
        console.log(`Scrapy loop finished. -> taskId -> `, taskId);
    }
};

export const scrapyTask = async (item: ScrapyItem, cookie: string, signal?: AbortSignal): Promise<boolean> => {
    try {
        const requestBody: SearchCategoryRequestBody & { mid: any } = {
            ...item.searchParams,
            pageIndex: item.NextToken, // 使用 ScrapyItem 中的 NextToken
            userId: "21603",
            mid: 21603,
        };

        console.log('requestBody -> ', JSON.stringify(requestBody, null, 2))

        const response = await axios.post(`${baseUrl}/mall/noah/search/category/v2`, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        });

        const data = response.data;
        const GoodsList: SearchCategoryGoodsItem[] = response.data?.data?.list || []
        console.log(`Scrapy task ${item.ID} -> item.NextToken, GoodsList.length, response.data?.data -> `, item.NextToken, GoodsList.length, omit(response.data?.data, ['list']))
        if (GoodsList.length > 0) {
            try {
                insertSearchGoodsItems(GoodsList);
                // 更新 NextToken
                item.NextToken = item.NextToken + 1; // 确保 NextToken 是 number 类型
                updateScrapyItem(item);
                return data.data.hasNextPage;
            } catch (err) {
                console.error(`Scrapy task ${item.ID} failed with error: -> insertSearchGoodsItems or updateScrapyItem -> `, err);
                return false;
            }

        } else if (data.code === 429) {
            console.warn(`Rate limit hit for task ${item.ID}. Waiting...`);
            await new Promise(resolve => setTimeout(resolve, 10000)); // 等待 10 秒
            return data.data.hasNextPage; // 尝试重新运行
        } else {
            console.error(`Scrapy task ${item.ID} failed with code ${data.code}: ${data.message}`);
            return false;
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log(`Scrapy task ${item.ID} was cancelled.`);
        } else {
            let err = error
            if (axios.isAxiosError(err) && err.response) {
                err = pick(err.response, ['data', 'status', 'headers'])
            }
            console.error(`Error during scrapyTask for ID ${item.ID}:`, err);
        }
        return false;
    }
};

// 任务管理
let currentRunningTaskId: number | null = null;

export const startTask = async (taskId: number, cookie: string) => {
    if (currentRunningTaskId !== null) {
        console.log(`Task ${currentRunningTaskId} is already running. Cannot start new task. -> taskId -> `, taskId);
        return;
    }
    currentRunningTaskId = taskId;
    console.log('startTask', taskId, cookie);

    let item = readScrapyItem(taskId);
    if (item) {
        item.Status = 1; // 设置为运行中
        item.NextToken = 1; // 重置 NextToken
        updateScrapyItem(item);
    }

    // 启动爬虫循环 (非阻塞)
    scrapyLoop(taskId, cookie);
};

export const stopTask = (taskId: number) => {
    const abortController = abortControllers.get(taskId);
    if (abortController) {
        abortController.abort();
        console.log(`Scrapy task stop signal sent. -> taskId -> `, taskId);
    } else {
        console.log(`Scrapy task is not running or already stopped. -> taskId -> `, taskId);
    }
};

export const getNowRunTaskId = (): number | null => {
    console.log('getNowRunTaskId', currentRunningTaskId);
    return currentRunningTaskId;
};
