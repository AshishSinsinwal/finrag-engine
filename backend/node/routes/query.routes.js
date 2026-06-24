import express from 'express';
import { 
    getContextualQueries, 
    summarizeQuery, 
    historyManagement, 
    pinQuery, 
    deleteQuery,
    getQueryById 
} from '../controllers/query.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';

const router = express.Router();
console.log("Query routes initialized.");

// Swapped search endpoint to POST to accommodate the incoming query string block inside req.body
router.post('/search', authMiddleware, getContextualQueries);
router.post('/summarize', authMiddleware, summarizeQuery);
router.get('/history', authMiddleware, historyManagement);
router.patch('/pin/:id', authMiddleware, pinQuery);
router.delete('/:id', authMiddleware, deleteQuery);
router.get("/:id",authMiddleware, getQueryById);
export default router;