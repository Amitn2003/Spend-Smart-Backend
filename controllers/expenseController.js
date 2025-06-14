import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

// ✅ Create Expense
export const createExpense = async (req, res) => {
  try {
    const { category, subcategory, amount, description, date, time, note, type } = req.body;
    console.log(req.body, "create expense");

    if (!category || !amount || !date || !type) {
      return res.status(400).json({ message: 'Category, amount, date, and type are required' });
    }
    console.log("working" + category, subcategory, amount, description, date, time, note, type);

    const expense = await Expense.create({
      user: req.user._id,
      category,
      subcategory,
      amount,
      description,
      date,
      time,
      note,
      type
    });

    res.status(201).json({ message: 'Expense created', expense });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create expense' });
  }
};

// ✅ Get All (with optional filtering)
export const getExpenses = async (req, res) => {
  try {
    const { category, minAmount, maxAmount, fromDate, toDate } = req.query;
    const filter = { user: req.user._id };
    console.log(filter, "filter");

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }

    const expenses = await Expense.find(filter)
      .populate('category', 'name')
      .sort({ date: -1 });
    console.log(expenses, "expenses");
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found' });
    }

    res.json({ expenses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

// ✅ Update Expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: 'Expense updated', expense: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// ✅ Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    await expense.remove();
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
};
