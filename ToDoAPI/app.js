const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use(cors({
  origin: 'https://todoapp-ma89.onrender.com', // твій фронтенд
  methods: ['GET','POST','PATCH','DELETE'],
}));

// API маршрути
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Serve React frontend
const buildPath = path.join(__dirname, '../todo-client/build');
app.use(express.static(buildPath));

// Для будь-якого іншого маршруту віддаємо index.html (React Router працює)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
