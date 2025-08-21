const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
};

exports.createTask = async (req, res) => {
    const { title, priority } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const newTask = await Task.create({
        user: req.user._id,
        priority: priority >= 1 && priority <= 10 ? priority : 5,
        title,
    });

    res.status(201).json(newTask);
};
exports.updateTaskStatus = async (req, res) => {
    console.log("status");
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
  console.log("updateTask called", req.body);

  try {
    const { title, completed, priority } = req.body;
    const updateFields = {};

    if (typeof title === "string" && title.trim() !== "") {
      updateFields.title = title.trim();
    }

    if (typeof completed === "boolean") {
      updateFields.completed = completed;
    }

    if (priority !== undefined) {
      const numPriority = parseInt(priority, 10);
      updateFields.priority = Math.min(Math.max(numPriority, 1), 10);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateFields,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Помилка при оновленні:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted' });
};

exports.getTasks = async (req, res) => {
  try {
    const { search, sort } = req.query;
    let query = { user: req.user.id };

    if (search) {
      query.title = { $regex: search, $options: "i" }; // case-insensitive
    }

    let tasks = await Task.find(query);

    if (sort === "asc") {
      tasks = tasks.sort((a, b) => a.priority - b.priority);
    } else if (sort === "desc") {
      tasks = tasks.sort((a, b) => b.priority - a.priority);
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};