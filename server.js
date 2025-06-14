import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// import categoryRoutes from './routes/categoryRoutes.js'; // optional, if not inside admin





import connectDB from './config/db.js'; // your custom db connect file
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://spendingsmart.vercel.app'],  // Allow both origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));

// ✅ CORRECT ORDER
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); // <-- This MUST be before routes
app.use(express.urlencoded({ extended: true })); // Optional, but useful


// ✅ Middleware
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(express.json()); // For parsing appl



// ✅ Routes
app.get('/', (req, res) => {
    res.send('Backend server is running successfully!');
});

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Expense Tracker API!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/categories', categoryRoutes); // optional if needed






// ✅ Error Handlers
app.use(notFound);       // 404 Not Found middleware
app.use(errorHandler);   // General error handler middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
