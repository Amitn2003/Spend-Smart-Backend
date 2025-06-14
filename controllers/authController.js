import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { z } from 'zod';

// Zod validation schema
const userSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    console.log(req.body, "register")
    const validatedData = userSchema.parse(req.body);
    const { username, email, password } = validatedData;
    console.log(validatedData, "validatedData")
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });
    console.log(userExists, "User exist")
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body, " login")

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    console.log(user, "user")
    // Check if the password matches

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    console.log(isMatch, "isMatch")
    // Generate JWT token

    const token = generateToken(user._id, user.role);
    console.log(token, "token")
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};
