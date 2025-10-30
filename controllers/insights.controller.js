const db = require("../database/db");

function getUserInsights(userId) {
  const totalOpen = db
    .prepare("SELECT COUNT(*) as c FROM tasks WHERE user_id=? AND status='Open'")
    .get(userId).c;

  const priorityCount = db
    .prepare("SELECT priority, COUNT(*) as c FROM tasks WHERE user_id=? GROUP BY priority")
    .all(userId);

  const dueSoon = db
    .prepare("SELECT COUNT(*) as c FROM tasks WHERE user_id=? AND due_date <= date('now', '+3 day')")
    .get(userId).c;

  const timeline = db
    .prepare(`
      SELECT due_date, COUNT(*) as count 
      FROM tasks 
      WHERE user_id=? 
        AND due_date BETWEEN date('now') AND date('now', '+7 day')
      GROUP BY due_date
      ORDER BY due_date
    `)
    .all(userId);

  const highPriority = priorityCount.find((p) => p.priority === "High")?.c || 0;
  let summary = `You have ${totalOpen} open tasks.`;
  if (highPriority > totalOpen / 2) summary += " Most of them are High priority!";
  if (dueSoon > 0) summary += ` ${dueSoon} are due within 3 days.`;

  return { totalOpen, priorityCount, dueSoon, timeline, summary };
}

module.exports = { getUserInsights };
