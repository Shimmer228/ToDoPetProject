import React from 'react';

const TaskItem = ({ task, onToggle, onDelete }) => (
  <li style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
    <span
      style={{
        textDecoration: task.completed ? 'line-through' : 'none',
        cursor: 'pointer',
      }}
      onClick={onToggle}
    >
      {task.title}
    </span>
    <button onClick={onDelete}>❌</button>
  </li>
);

export default TaskItem;