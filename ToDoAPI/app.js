const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use(express.json());

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
app.use(express.static(path.join(__dirname, '../todo-client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../todo-client/build', 'index.html'));
});
module.exports = app;
