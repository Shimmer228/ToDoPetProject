const express = require('express');
const cors = require('cors'); // <-- додаємо cors
const app = express();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use(express.json());

// Додаємо CORS
app.use(cors({
  origin: 'https://todoapp-ma89.onrender.com',
  methods: ['GET','POST','PATCH','DELETE'],
  credentials: true
}));

app.get('/', (req, res) => {
    res.send('API is working ✅');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

module.exports = app;
