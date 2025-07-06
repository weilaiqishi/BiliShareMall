import { Router } from 'express';
import {
    addScrapy,
    getAllScrapyItems,
    getScrapyItemById,
    updateScrapy,
    deleteScrapy,
    runScrapyTask,
    stopScrapyTask,
    getRunningScrapyTask
} from '../controllers/scrapyController';

const router = Router();

// Scrapy Item CRUD routes
router.post('/scrapy/items', addScrapy);
router.get('/scrapy/items', getAllScrapyItems);
router.get('/scrapy/items/:id', getScrapyItemById);
router.put('/scrapy/items', updateScrapy);
router.delete('/scrapy/items/:id', deleteScrapy);

// Scrapy Task management routes
router.post('/scrapy/run', runScrapyTask);
router.post('/scrapy/stop', stopScrapyTask);
router.get('/scrapy/running-task', getRunningScrapyTask);

export default router;