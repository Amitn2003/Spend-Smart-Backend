import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phone: { type: String, default: '' },
  age: { type: Number, default: null },
  gender: { type: String, default: '' },
  address: { type: String, default: '' },  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
