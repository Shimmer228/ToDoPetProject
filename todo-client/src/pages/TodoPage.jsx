import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from "../config";
import axios from 'axios';

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState(1);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingPriority, setEditingPriority] = useState(1);

  const [filter, setFilter] = useState('all'); // all | done | undone
  const [sortOrder, setSortOrder] = useState('asc'); // asc | desc
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      await axios.put(
        `${API_URL}/api/tasks/${taskId}`,
        { title: editingTitle, priority: editingPriority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingTaskId(null);
      setEditingTitle('');
      setEditingPriority(1);
      fetchTasks();
    } catch (err) {
      console.error('Error editing task:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await axios.post(
        `${API_URL}/api/tasks`,
        { title: newTask, priority: newPriority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask('');
      setNewPriority(1);
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    try {
      await axios.patch(
        `${API_URL}/api/tasks/${taskId}`,
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'done') return task.completed;
      if (filter === 'undone') return !task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder === 'asc'
        ? a.priority - b.priority
        : b.priority - a.priority;
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
            Sign out
          </button>
        </div>

        {/* Додавання нової задачі */}
        <form onSubmit={handleAddTask} className="flex space-x-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
            className="flex-grow px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            min="1"
            value={newPriority}
            onChange={(e) => setNewPriority(Number(e.target.value))}
            placeholder="Priority"
            className="w-24 px-2 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add
          </button>
        </form>

        {/* Пошук і сортування */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Name search..."
            className="flex-grow px-3 py-2 border rounded-md"
          />
          <button
            onClick={() =>
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
            }
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Sort {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Фільтри */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('done')}
            className={`px-3 py-1 rounded ${
              filter === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Done
          </button>
          <button
            onClick={() => setFilter('undone')}
            className={`px-3 py-1 rounded ${
              filter === 'undone' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Not done
          </button>
        </div>

        {/* Список завдань */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks for now</p>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
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
                    onChange={() =>
                      handleToggleStatus(task._id, task.completed)
                    }
                    className="w-5 h-5 text-green-600 accent-green-600"
                  />

                  {editingTaskId === task._id ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                        autoFocus
                      />
                      <input
                        type="number"
                        min="1"
                        value={editingPriority}
                        onChange={(e) =>
                          setEditingPriority(Number(e.target.value))
                        }
                        className="w-20 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={() => handleUpdateTask(task._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`text-lg flex-1 ${
                          task.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-sm text-gray-600">
                        Priority: {task.priority}
                      </span>
                    </>
                  )}
                </div>

                {/* Кнопки */}
                {editingTaskId !== task._id && (
                  <button
                    onClick={() => {
                      setEditingTaskId(task._id);
                      setEditingTitle(task.title);
                      setEditingPriority(task.priority);
                    }}
                    className="text-blue-600 hover:underline text-sm mr-2"
                  >
                    ✏️
                  </button>
                )}

                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
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
