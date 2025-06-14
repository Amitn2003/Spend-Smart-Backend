import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllExpenses,
  updateExpenseByAdmin,
  deleteExpenseByAdmin,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/adminController.js';

import { protect, isAdmin } from '../middlewares/authMiddleeware.js';

const router = express.Router();

router.use(protect, isAdmin);

// 🔧 Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// 🔧 Expenses
router.get('/expenses', getAllExpenses);
router.put('/expenses/:id', updateExpenseByAdmin);
router.delete('/expenses/:id', deleteExpenseByAdmin);

// 🔧 Categories
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
