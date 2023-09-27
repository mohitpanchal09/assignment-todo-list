const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Signup Controller
exports.signup = async (req, res) => {
    try {
      const { username, password } = req.body;
    //   console.log(req.body);
  
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      const newUser = new User({
        username,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
     // Generate and send a JWT token
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
        res.header('auth-token', token).json({
        token,
        user: {
            _id: newUser._id,
            username: newUser.username,
        },
        });
    } catch (error) {
        console.error(error);
         res.status(500).json({ message: 'Internal server error' });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the username exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Generate and send a JWT token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.header('auth-token', token).json({
        token,
        user: {
          _id: user._id,
          username: user.username,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};