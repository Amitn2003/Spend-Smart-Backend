import express from 'express';
import {
  getUserProfile,
  getUserExpenses,
  getUserDashboardStats,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleeware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.get('/expenses', protect, getUserExpenses);
router.get('/dashboard', protect, getUserDashboardStats);

export default router;
