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
router.post('/items', addScrapy);
router.get('/items', getAllScrapyItems);
router.get('/items/:id', getScrapyItemById);
router.put('/items', updateScrapy);
router.delete('/items/:id', deleteScrapy);

// Scrapy Task management routes
router.post('/run', runScrapyTask);
router.post('/stop', stopScrapyTask);
router.get('/running-task', getRunningScrapyTask);

export default router;