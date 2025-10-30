const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const { getUserInsights } = require("../controllers/insights.controller");

router.get("/", authMiddleware, (req, res) => {
  try {
    const userId = req.userId;
    const insights = getUserInsights(userId);
    res.json(insights);
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

module.exports = router;
