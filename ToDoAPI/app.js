const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes')
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is working ✅');
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks',taskRoutes);

module.exports = app;