import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String }, // Optional (e.g. for dashboard visuals)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin user
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Category', categorySchema);
