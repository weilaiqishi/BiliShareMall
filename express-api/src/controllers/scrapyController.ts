import { Request, Response } from 'express';
import { omit } from 'es-toolkit';
import { z } from 'zod';

import { 
    createScrapyItem, 
    readScrapyItem, 
    readAllScrapyItems, 
    updateScrapyItem, 
    deleteScrapyItem, 
    startTask, 
    stopTask, 
    getNowRunTaskId 
} from '../services/scrapyService';


const addScrapySchema = z.object({
    Name: z.string(),
    Cookie: z.string(),
    searchParams: z.object({}).passthrough(), // 允许 searchParams 包含未定义的字段
});

export const addScrapy = (req: Request, res: Response) => {
    try {
        const parsedBody = addScrapySchema.safeParse(req.body);

        if (!parsedBody.success) {
            res.status(400).json({ message: 'Invalid request body', errors: parsedBody.error.errors });
            return;
        }

        const { Name, Cookie, searchParams } = parsedBody.data;
        const lastInsertRowid = createScrapyItem({ Name, Cookie, searchParams });
        res.status(200).json({ message: 'Scrapy item added successfully', item: { id: lastInsertRowid, Name, Cookie, searchParams } });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to add scrapy item', error: error.message });
    }
};

export const getAllScrapyItems = (req: Request, res: Response) => {
    try {
        const items = readAllScrapyItems();
        res.status(200).json(items);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve scrapy items', error: error.message });
    }
};

export const getScrapyItemById = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const item = readScrapyItem(id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ message: 'Scrapy item not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve scrapy item', error: error.message });
    }
};

export const updateScrapy = (req: Request, res: Response) => {
    try {
        const updatedItem = req.body; // 假设请求体包含更新后的 ScrapyItem 数据
        updateScrapyItem(updatedItem);
        res.status(200).json({ message: 'Scrapy item updated successfully', item: updatedItem });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update scrapy item', error: error.message });
    }
};

export const deleteScrapy = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        deleteScrapyItem(id);
        res.status(200).json({ message: `Scrapy item with ID ${id} deleted successfully` });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to delete scrapy item', error: error.message });
    }
};

export const runScrapyTask = (req: Request, res: Response) => {
    try {
        const { taskId, cookie } = req.body; // 假设请求体包含 taskId 和 cookie
        if (typeof taskId !== 'number' || typeof cookie !== 'string') {
            res.status(400).json({ message: 'Invalid taskId or cookie provided' });
            return
        }
        startTask(taskId, cookie);
        res.status(200).json({ message: `Scrapy task started -> taskId -> `, taskId });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to start scrapy task', error: error.message });
    }
};

export const stopScrapyTask = (req: Request, res: Response) => {
    try {
        const { taskId } = req.body; // 假设请求体包含 taskId
        if (typeof taskId !== 'number') {
            res.status(400).json({ message: 'Invalid taskId provided' });
            return
        }
        stopTask(taskId);
        res.status(200).json({ message: `Scrapy task stopped -> `, taskId });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to stop scrapy task', error: error.message });
    }
};

export const getRunningScrapyTask = (req: Request, res: Response) => {
    try {
        const taskId = getNowRunTaskId();
        res.status(200).json({ runningTaskId: taskId });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get running scrapy task', error: error.message });
    }
};