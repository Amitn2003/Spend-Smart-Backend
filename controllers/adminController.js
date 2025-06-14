import User from '../models/User.js';
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

// 👥 Get all users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// 🔍 Get user profile + performance
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  const expenses = await Expense.find({ user: req.params.id });

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    user,
    totalSpent: expenses.reduce((acc, exp) => acc + exp.amount, 0),
    expenseCount: expenses.length,
  });
};

// ✏️ Edit user
export const updateUser = async (req, res) => {
  const { username, role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.username = username || user.username;
  user.role = role || user.role;

  const updated = await user.save();
  res.json({ message: 'User updated', user: updated });
};

// ❌ Delete user
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await Expense.deleteMany({ user: user._id });
  await user.remove();
  res.json({ message: 'User and related expenses deleted' });
};

// 📄 Get all expenses
export const getAllExpenses = async (req, res) => {
  const expenses = await Expense.find().populate('user', 'username email').populate('category', 'name');
  res.json(expenses);
};

// ✏️ Update any expense
export const updateExpenseByAdmin = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Expense not found' });

  Object.assign(expense, req.body);
  const updated = await expense.save();

  res.json({ message: 'Expense updated', expense: updated });
};

// ❌ Delete any expense
export const deleteExpenseByAdmin = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Expense not found' });

  await expense.remove();
  res.json({ message: 'Expense deleted' });
};

// 📦 Category Management
export const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });

  const existing = await Category.findOne({ name: name.trim().toLowerCase() });
  if (existing) return res.status(400).json({ message: 'Category already exists' });

  const category = await Category.create({ name });
  res.status(201).json({ message: 'Category created', category });
};

export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  category.name = req.body.name || category.name;
  const updated = await category.save();
  res.json({ message: 'Category updated', category: updated });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  await category.remove();
  res.json({ message: 'Category deleted' });
};
