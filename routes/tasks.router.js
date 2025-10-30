const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const {
  createTask,
  getTasks,
  updateTask,
} = require("../controllers/task.controller");

router.post("/", authMiddleware, (req, res) => {
  try {
    const result = createTask(req.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", authMiddleware, (req, res) => {
  try {
    const tasks = getTasks(req.userId, req.query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.patch("/:id", authMiddleware, (req, res) => {
  try {
    const result = updateTask(req.userId, req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
