import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

export const registerUser = async (req, res) => {
  console.log("REGISTER REQUEST: ",req.body);

  try {
    const { username, email, password, role } = req.body
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({ username, email, password: hashedPassword, role })
    generateToken(res, user._id)

    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body
    const user = await User.findOne({ email, role })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    generateToken(res, user._id)

    res.json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const logoutUser = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) })
  res.json({ message: 'Logged out' })
}

export const getMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' })
  res.json(req.user)
}