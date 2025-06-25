const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
};

exports.createTask = async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const newTask = await Task.create({
        user: req.user._id,
        title,
    });

    res.status(201).json(newTask);
};
exports.updateTaskStatus = async (req, res) => {
  try {
    const { completed, title } = req.body;
    const updateFields = {};
    if (typeof completed === 'boolean') updateFields.completed = completed;
    if (title) updateFields.title = title;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateFields,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Задачу не знайдено' });

    res.json(task);
  } catch (err) {
    console.error('Помилка при оновленні статусу:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};


exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted' });
};