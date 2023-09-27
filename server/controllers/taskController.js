const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    try {
      const { title } = req.body;
  
      // Get the user ID from the authentication token
      const userId = req.user._id;
  
      // Create a new task associated with the user
      const newTask = new Task({
        title,
        user: userId,
      });
  
      // Save the task to the database
      await newTask.save();
  
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
  
// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
    try {
      // Get the user ID from the authentication token
      const userId = req.user._id;
  
      // Find tasks associated with the user
      const tasks = await Task.find({ user: userId });
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
  
// Get a single task by ID
exports.getTaskById = async (req, res) => {
    try {
      const taskId = req.params.id;
      // Find the task by ID and ensure it's associated with the authenticated user
      const task = await Task.findOne({ _id: taskId, user: req.user._id });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
  
// Update a task by ID
exports.updateTask = async (req, res) => {
    try {
      const taskId = req.params.id;
      const { title, completed } = req.body;
  
      // Find and update the task by ID and ensure it's associated with the authenticated user
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, user: req.user._id },
        { title, completed },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
  
// Delete a task by ID
exports.deleteTask = async (req, res) => {
    try {
      const taskId = req.params.id;
  
      // Find and delete the task by ID and ensure it's associated with the authenticated user
      const deletedTask = await Task.findOneAndRemove({ _id: taskId, user: req.user._id });
  
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};