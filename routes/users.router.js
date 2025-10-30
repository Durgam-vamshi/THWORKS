
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");

router.post("/register", (req, res) => {
  try {
    const result = registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", (req, res) => {
  try {
    const result = loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
