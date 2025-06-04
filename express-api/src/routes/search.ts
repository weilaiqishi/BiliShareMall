import { Router } from 'express';
import { searchCategory } from '../controllers/search';

const router = Router();

router.post('/search/category', searchCategory);

export const searchRouter = router;