  const bcrypt = require("bcrypt");
  const db = require("../database/db");
  const { generateToken } = require("../utils/generateToken");

  function registerUser(userData) {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw new Error("All fields required");
    }

    const hash = bcrypt.hashSync(password, 10);

    const stmt = db.prepare(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
    );

    try {
      stmt.run(name, email, hash);
      return { message: "User registered successfully" };
    } catch (err) {
      throw new Error("Email already exists");
    }
  }

  function loginUser(loginData) {
    const { email, password } = loginData;

    const user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) throw new Error("Invalid credentials");

    const token = generateToken(user.id);
    return { token };
  }

  module.exports = {
    registerUser,
    loginUser,
  };
