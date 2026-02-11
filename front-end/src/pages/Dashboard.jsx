import { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/UserContext";
import axios from "axios";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(userContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(API.getTasks, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate("/");
      } else {
        setError("Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchTasks();
  }, [navigate]);

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        API.getTasks,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(res.data);
      setTitle("");
      setError("");
    } catch (err) {
      setError("Failed to add task");
      console.error(err);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API.getTasks}/${taskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? { ...task, completed: !task.completed }
            : task
        )
      );
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API.getTasks}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setError("");
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.name || "User"}!
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What needs to be done?"
        />
        <button
          onClick={addTask}
          disabled={!title.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded font-semibold transition"
        >
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No tasks yet. Add one to get started!
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span
                  className={
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }
                >
                  {task.title}
                </span>
              </div>

              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:text-red-700 font-semibold transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}