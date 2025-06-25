import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [filter, setFilter] = useState('all'); // all | done | undone
  const navigate = useNavigate();


  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Помилка при завантаженні задач:', err);
    }
  };
const handleUpdateTitle = async (taskId) => {
  try {
    await axios.patch(`/api/tasks/${taskId}`, { title: editingTitle }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditingTaskId(null);
    setEditingTitle('');
    fetchTasks();
  } catch (err) {
    console.error('Помилка при редагуванні задачі:', err);
  }
};

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await axios.post('/api/tasks', { title: newTask }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTask('');
      fetchTasks();
    } catch (err) {
      console.error('Помилка при створенні задачі:', err);
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { completed: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error('Помилка при оновленні статусу:', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error('Помилка при видаленні задачі:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'done') return task.completed;
    if (filter === 'undone') return !task.completed;
    return true;
  });


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Ваші завдання</h1>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Вийти
            </button>
          </div>
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Ваші завдання</h1>

        {/* Додавання нової задачі */}
        <form onSubmit={handleAddTask} className="flex space-x-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Нове завдання..."
            className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Додати
          </button>
        </form>
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Всі
          </button>
          <button
            onClick={() => setFilter('done')}
            className={`px-3 py-1 rounded ${filter === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Виконані
          </button>
          <button
            onClick={() => setFilter('undone')}
            className={`px-3 py-1 rounded ${filter === 'undone' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Невиконані
          </button>
        </div>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">Завдань поки немає</p>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map(task => (
              <li
                key={task._id}
                className={`p-4 rounded shadow flex justify-between items-center ${
                  task.completed ? 'bg-green-100' : 'bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleStatus(task._id, task.completed)}
                    className="w-5 h-5 text-green-600 accent-green-600"
                  />

                  {editingTaskId === task._id ? (
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => handleUpdateTitle(task._id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdateTitle(task._id);
                      }}
                      className="flex-1 px-2 py-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`text-lg flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                    >
                      {task.title}
                    </span>
                  )}
                </div>

                {/* Кнопка редагування */}
                {editingTaskId !== task._id && (
                  <button
                    onClick={() => {
                      setEditingTaskId(task._id);
                      setEditingTitle(task.title);
                    }}
                    className="text-blue-600 hover:underline text-sm mr-2"
                  >
                    ✏️
                  </button>
                )}

                {/* Кнопка видалення */}
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Видалити
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoPage;
