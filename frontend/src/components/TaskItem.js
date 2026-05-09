function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <div style={{ ...styles.card, borderLeft: task.completed ? "4px solid #57bb6b" : "4px solid #4a90e2" }}>
      <div style={styles.topRow}>
        <p style={{ ...styles.title, textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#999" : "#222" }}>
          {task.title}
        </p>
        <span style={{ ...styles.statusBadge, backgroundColor: task.completed ? "#e6f9ec" : "#e8f0fb", color: task.completed ? "#57bb6b" : "#4a90e2" }}>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>

      {task.description && (
        <div style={styles.descriptionBox}>
          <p style={styles.description}>{task.description}</p>
        </div>
      )}

      <div style={styles.metaRow}>
        <span style={styles.metaText}>Due: {formattedDate}</span>
        <span style={styles.metaDot}>•</span>
        <span style={styles.metaText}>Added by: {task.createdByName || "Unknown"}</span>
      </div>

      <div style={styles.actionsRow}>
        <button
          onClick={() => onToggleComplete(task)}
          style={task.completed ? styles.undoBtn : styles.completeBtn}
        >
          {task.completed ? "Mark as Pending" : "Mark as Completed"}
        </button>
        <button onClick={() => onEdit(task)} style={styles.editBtn}>
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} style={styles.deleteBtn}>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "16px 18px",
    borderRadius: "8px",
    marginBottom: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
    gap: "10px",
  },
  title: {
    fontSize: "15px",
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    fontSize: "12px",
    padding: "3px 10px",
    borderRadius: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  descriptionBox: {
    backgroundColor: "#f8f9fb",
    border: "1px solid #e8e8e8",
    borderRadius: "5px",
    padding: "8px 10px",
    marginBottom: "10px",
    maxHeight: "80px",
    overflowY: "auto",
  },
  description: {
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.5",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "12px",
  },
  metaText: {
    fontSize: "12px",
    color: "#999",
  },
  metaDot: {
    fontSize: "12px",
    color: "#ccc",
  },
  actionsRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  completeBtn: {
    padding: "5px 14px",
    backgroundColor: "#57bb6b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  undoBtn: {
    padding: "5px 14px",
    backgroundColor: "#999",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  editBtn: {
    padding: "5px 14px",
    backgroundColor: "#f0a500",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  deleteBtn: {
    padding: "5px 14px",
    backgroundColor: "#e05252",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default TaskItem;