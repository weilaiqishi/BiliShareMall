import { Router } from 'express';
import { getScrapyItems, getC2CItems } from '../services/sqlite';

const router = Router();

router.get('/sqlite/scrapy-items', (req, res) => {
    try {
        const items = getScrapyItems();
        res.json(items);
    } catch (error) {
        console.error('Error getting scrapy items:', error);
        res.status(500).json({ error: 'Failed to retrieve scrapy items' });
    }
});

router.get('/sqlite/c2c-items', (req, res) => {
    try {
        const items = getC2CItems();
        res.json(items);
    } catch (error) {
        console.error('Error getting c2c items:', error);
        res.status(500).json({ error: 'Failed to retrieve c2c items' });
    }
});

export const sqliteRouter = router;