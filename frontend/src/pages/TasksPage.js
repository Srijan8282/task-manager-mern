import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

const socket = io(import.meta.env.VITE_BACKEND_URL);

function TasksPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

  const fetchTasks = async (page) => {
    try {
      const res = await api.get(`/tasks?page=${page}&limit=5`);
      setTasks(res.data.tasks);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalTasks(res.data.totalTasks);
      setError("");
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    }
  };

  useEffect(() => {
    fetchTasks(1);
  }, []);

  useEffect(() => {
    socket.on("taskCreated", (newTask) => {
      showNotification(`New task added by ${newTask.createdByName}`);
      setTasks((prev) => {
        const updated = [newTask, ...prev];
        if (updated.length > 5) updated.pop();
        return updated;
      });
      setTotalTasks((prev) => prev + 1);
    });

    socket.on("taskUpdated", (updatedTask) => {
      showNotification("A task was updated");
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on("taskDeleted", ({ _id }) => {
      showNotification("A task was deleted");
      setTasks((prev) => prev.filter((t) => t._id !== _id));
      setTotalTasks((prev) => prev - 1);
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.post("/tasks", taskData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await api.put(`/tasks/${editTask._id}`, taskData);
      setEditTask(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <span style={styles.navTitle}>Task Manager</span>
        <div style={styles.navRight}>
          <div
            style={styles.avatar}
            onClick={() => setShowProfile(!showProfile)}
            title="View Profile"
          >
            {getInitials(user.name)}
          </div>
        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfile && (
        <div style={styles.profileCard}>
          <div style={styles.profileAvatar}>{getInitials(user.name)}</div>
          <p style={styles.profileName}>{user.name}</p>
          <p style={styles.profileEmail}>{user.email}</p>
          <button onClick={logout} style={styles.profileLogoutBtn}>
            Logout
          </button>
        </div>
      )}

      <div style={styles.container}>

        {notification && <div style={styles.notification}>{notification}</div>}
        {error && <p style={styles.error}>{error}</p>}

        <TaskForm
          onSubmit={editTask ? handleUpdateTask : handleCreateTask}
          editTask={editTask}
          onCancel={() => setEditTask(null)}
        />

        <div style={styles.taskListHeader}>
          <span style={styles.taskListTitle}>All Tasks</span>
          <span style={styles.taskCount}>{totalTasks} total</span>
        </div>

        {tasks.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center", marginTop: "40px" }}>
            No tasks yet. Add one above!
          </p>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={(t) => setEditTask(t)}
                onDelete={handleDelete}
              />
            ))}

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => fetchTasks(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    ...styles.pageBtn,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: "14px", color: "#555" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => fetchTasks(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.pageBtn,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#eef1f5",
    minHeight: "100vh",
  },
  navbar: {
    backgroundColor: "#4a90e2",
    padding: "0 24px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
    position: "relative",
  },
  navTitle: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    color: "#4a90e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    userSelect: "none",
  },
  profileCard: {
    position: "absolute",
    top: "62px",
    right: "24px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    zIndex: 100,
    textAlign: "center",
    width: "200px",
  },
  profileAvatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#4a90e2",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "20px",
    margin: "0 auto 12px",
  },
  profileName: {
    fontWeight: "600",
    fontSize: "15px",
    marginBottom: "4px",
  },
  profileEmail: {
    fontSize: "13px",
    color: "#888",
    marginBottom: "14px",
    wordBreak: "break-all",
  },
  profileLogoutBtn: {
    padding: "7px 20px",
    backgroundColor: "#e05252",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    width: "100%",
  },
  container: {
    maxWidth: "720px",
    margin: "30px auto",
    padding: "0 16px",
  },
  notification: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "14px",
    border: "1px solid #c3e6cb",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "12px",
  },
  taskListHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  taskListTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#444",
  },
  taskCount: {
    fontSize: "13px",
    color: "#999",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "18px",
    marginTop: "20px",
  },
  pageBtn: {
    padding: "7px 18px",
    backgroundColor: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
  },
};

export default TasksPage;