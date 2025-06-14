import Expense from '../models/Expense.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = req.user; // set from authMiddleware
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
};

// @route   GET /api/users/expenses
// @access  Private
export const getUserExpenses = async (req, res) => {
  try {
    console.log(req.body)
    const expenses = await Expense.find({ user: req.user._id })
      .populate('category', 'name')
      .sort({ date: -1 });

    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};

// @route   GET /api/users/dashboard
// @access  Private
export const getUserDashboardStats = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });

    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const categoryBreakdown = {};
    expenses.forEach((exp) => {
      const cat = exp.category.toString();
      if (!categoryBreakdown[cat]) categoryBreakdown[cat] = 0;
      categoryBreakdown[cat] += exp.amount;
    });

    res.json({
      totalSpent,
      expenseCount: expenses.length,
      categoryBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating dashboard data' });
  }
};
