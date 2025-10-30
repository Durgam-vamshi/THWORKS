const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./database/db");
const usersRouter = require("./routes/users.router");
const tasksRouter = require("./routes/tasks.router");
const insightsRouter = require("./routes/insights.router");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/insights", insightsRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(process.env.PORT, () =>
  console.log(` Server running on port ${process.env.PORT}`)
);
