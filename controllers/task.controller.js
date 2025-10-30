const db = require("../database/db");


function createTask(userId, taskData) {
  const { title, description, priority, due_date } = taskData;

  if (!title || !due_date) throw new Error("Title and due date required");

  const userExists = db.prepare("SELECT id FROM users WHERE id=?").get(userId);
  if (!userExists) throw new Error("Invalid user_id: user does not exist");

  const stmt = db.prepare(`
    INSERT INTO tasks (user_id, title, description, priority, due_date)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(userId, title, description, priority, due_date);

  return { id: result.lastInsertRowid, message: "Task created" };
}


function getTasks(userId, queryParams) {
  const { status, priority, sort = "due_date", order = "asc", page = 1, limit = 5 } = queryParams;
  let query = "SELECT * FROM tasks WHERE user_id=?";
  const params = [userId];

  if (status) {
    query += " AND status=?";
    params.push(status);
  }

  if (priority) {
    query += " AND priority=?";
    params.push(priority);
  }

  const safeOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  query += ` ORDER BY ${sort} ${safeOrder} LIMIT ? OFFSET ?`;
  params.push(Number(limit), (Number(page) - 1) * Number(limit));

  const tasks = db.prepare(query).all(...params);
  return tasks;
}



function updateTask(userId, taskId, updateData) {
  const { title, description, status, priority, due_date } = updateData;

  const stmt = db.prepare(`
    UPDATE tasks 
    SET 
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      priority = COALESCE(?, priority),
      due_date = COALESCE(?, due_date)
    WHERE id=? AND user_id=?`
  );

  const result = stmt.run(title, description, status, priority, due_date, taskId, userId);

  if (result.changes === 0) {
    throw new Error("Task not found or no changes made");
  }

  return { message: "Task updated" };
}


module.exports = {
  createTask,
  getTasks,
  updateTask,
};
