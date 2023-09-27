import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import server from '../../server'

function TodoList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState({ id: null, title: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks
  const fetchTasks = async () => {
    try {
      // Fetch tasks using your API endpoint (e.g., GET /api/tasks)
      const response = await fetch(`${server}/api/tasks`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token'), // Retrieve token from local storage
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function to create a new task
  const createTask = async () => {
    try {
      // Send a POST request to create a task using your API endpoint (e.g., POST /api/tasks)
      const response = await fetch(`${server}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'), // Retrieve token from local storage
        },
        body: JSON.stringify({ title: newTask }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data]); // Add the new task to the tasks list
        setNewTask(''); // Clear the input field
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Function to update a task
  const updateTask = async () => {
    try {
      // Send a PUT request to update a task using your API endpoint (e.g., PUT /api/tasks/:id)
      const response = await fetch(`${server}/tasks/${editTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'), // Retrieve token from local storage
        },
        body: JSON.stringify({ title: editTask.title }),
      });

      if (response.ok) {
        // Update the task in the local state
        setTasks(tasks.map((task) => (task._id === editTask.id ? { ...task, title: editTask.title } : task)));
        setEditTask({ id: null, title: '' }); // Clear the edit task
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      // Send a DELETE request to delete a task using your API endpoint (e.g., DELETE /api/tasks/:id)
      const response = await fetch(`${server}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'auth-token': localStorage.getItem('auth-token'), // Retrieve token from local storage
        },
      });
  
      if (response.ok) {
        // Update the tasks state by filtering out the deleted task
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  const handleLogout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem('auth-token');
    // Redirect the user to the login page
    navigate('/login');
  };

  // Filter tasks based on the search term
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-blue-200 min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold mb-4">Welcome, {user && user.username}</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleLogout}>
          Logout
        </button>
        <h2 className="text-xl mt-8 mb-4">Todo List</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            placeholder="New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="p-2 border rounded-md flex-grow"
          />
          <button
            onClick={createTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Task
          </button>
        </div>
        <ul>
          {filteredTasks.map((task) => (
            <li key={task._id} className="mb-2 p-2 bg-white rounded-md">
              {task._id === editTask.id ? (
                <div className="mb-2">
                  <input
                    type="text"
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                    className="p-2 border rounded-md"
                  />
                  <button
                    onClick={updateTask}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                  >
                    Update
                  </button>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>{task.title}</span>
                  <div>
                    <button
                      onClick={() => setEditTask({ id: task._id, title: task.title })}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
