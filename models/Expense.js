import mongoose from 'mongoose';

// Helper function to extract time from a date string
const extractTime = (date) => {
  if (date instanceof Date) {
    return date.toISOString().split('T')[1]; // Extract time in "HH:MM:SS" format
  }
  return '';
};


const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   type: { type: String, enum: ["income", "expense"], required: true }, // Type of transaction
  category: { type: String, required: true },
  subcategory: { type: String }, // Optional & user-defined
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, required: true }, // date of expense
  time: { type: String,
    default: function () {
      return extractTime(this.date); // Automatically derive time from date if not provided
    }
   }, // optional — can also derive from date if stored as ISO
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Expense', expenseSchema);
