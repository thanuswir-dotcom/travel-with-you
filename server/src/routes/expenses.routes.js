import { Router } from 'express';
import { getExpenses, createExpense, splitExpenses, deleteExpense } from '../controllers/expensesController.js';

const router = Router();

router.get('/', getExpenses);
router.post('/', createExpense);
router.post('/split', splitExpenses);
router.delete('/:id', deleteExpense);

export default router;
