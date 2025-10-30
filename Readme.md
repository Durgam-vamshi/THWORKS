Task Tracker API

A simple Task Tracker backend API built with Node.js, Express, and SQLite. This API supports user registration, login, task management (CRUD operations), and user insights like task summaries and upcoming deadlines.

Table of Contents

Features

Tech Stack

Database Schema

API Endpoints

Authentication

Installation

Usage

Project Structure

Error Handling

Features

User Management: Register and login with secure password hashing.

Task Management: Create, read, update tasks with filters for status, priority, and pagination.

Insights Dashboard: Get a summary of tasks, upcoming deadlines, and high-priority tasks.

JWT-based Authentication: Secure routes for authenticated users only.

Tech Stack

Node.js - Server-side runtime

Express.js - Web framework

SQLite - Lightweight database

bcrypt - Password hashing

jsonwebtoken - JWT token generation for authentication

dotenv - Environment variable management

Database Schema

Database: task_tracker.db

Tables
1. users
Column	Type	Constraints
id	INTEGER	PRIMARY KEY, AUTOINCREMENT
name	TEXT	NOT NULL
email	TEXT	UNIQUE, NOT NULL
password_hash	TEXT	NOT NULL
2. tasks
Column	Type	Constraints
id	INTEGER	PRIMARY KEY, AUTOINCREMENT
user_id	INTEGER	FOREIGN KEY → users(id)
title	TEXT	NOT NULL
description	TEXT	Optional
status	TEXT	Default: 'Open', values: Open/Done
priority	TEXT	Values: Low/Medium/High
due_date	DATE	NOT NULL
API Endpoints
1. User Authentication
Register a User

Endpoint: POST /api/users/register

Request Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}


Response:

{
  "message": "User registered successfully"
}

Login a User

Endpoint: POST /api/users/login

Request Body:

{
  "email": "john@example.com",
  "password": "securepassword"
}


Response:

{
  "token": "JWT_TOKEN_HERE"
}

2. Task Management

All task endpoints require JWT in Authorization header: Bearer TOKEN

Create Task

Endpoint: POST /api/tasks

Request Body:

{
  "title": "Finish project",
  "description": "Complete the backend API",
  "priority": "High",
  "due_date": "2025-11-05"
}


Response:

{
  "id": 1,
  "message": "Task created"
}

Get Tasks

Endpoint: GET /api/tasks

Query Parameters:

status (Open/Done)

priority (Low/Medium/High)

sort (due_date by default)

order (asc or desc)

page (default 1)

limit (default 5)

Response: Array of task objects

Update Task

Endpoint: PATCH /api/tasks/:id

Request Body: Partial update allowed

{
  "status": "Done",
  "priority": "Medium"
}


Response:

{
  "message": "Task updated"
}

3. User Insights

Endpoint: GET /api/insights

Response:

{
  "totalOpen": 5,
  "priorityCount": [
    {"priority": "High", "c": 3},
    {"priority": "Medium", "c": 2}
  ],
  "dueSoon": 2,
  "timeline": [
    {"due_date": "2025-11-01", "count": 1},
    {"due_date": "2025-11-03", "count": 2}
  ],
  "summary": "You have 5 open tasks. Most of them are High priority! 2 are due within 3 days."
}

Authentication

JWT tokens are issued on login with 1-day expiration.

Protected endpoints check the token using middleware:

Authorization: Bearer <JWT_TOKEN>

Installation

Clone the repo:

git clone <repo_url>
cd task-tracker-api


Install dependencies:

npm install


Create a .env file:

PORT=3000
DB_PATH=./task_tracker.db
JWT_SECRET=YOUR_SECRET_KEY


Run the server:

node server.js

Usage

The API can be tested using Postman or cURL.

Default server runs on http://localhost:3000.

All task and insights routes require a valid JWT token from login.

Project Structure
.
├── controllers
│   ├── auth.controller.js
│   ├── task.controller.js
│   └── insights.controller.js
├── database
│   └── db.js
├── middlewares
│   ├── auth.js
│   └── errorHandler.js
├── routes
│   ├── users.router.js
│   ├── tasks.router.js
│   └── insights.router.js
├── utils
│   └── generateToken.js
├── .env
├── package.json
└── server.js

Error Handling

400 Bad Request: Invalid input or missing fields.

401 Unauthorized: Missing or invalid JWT token.

403 Forbidden: JWT token verification failed.

500 Internal Server Error: Server-side errors are logged and returned with a generic message.





Database Initialization (SQLite)

You can initialize your database using the following SQL script. Save it as init_db.sql and run:

sqlite3 task_tracker.db < init_db.sql

init_db.sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Open',
    priority TEXT,
    due_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


This script will create the necessary users and tasks tables with proper constraints.

Postman Collection (Sample Requests)

You can import this JSON into Postman to quickly test all API endpoints.

{
  "info": {
    "name": "Task Tracker API",
    "_postman_id": "12345-abcde-67890",
    "description": "Sample collection for Task Tracker API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "http://localhost:3000/api/users/register", "protocol": "http", "host": ["localhost"], "port": "3000", "path": ["api","users","register"]},
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": {"raw": "http://localhost:3000/api/users/login", "protocol": "http", "host": ["localhost"], "port": "3000", "path": ["api","users","login"]},
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
        }
      }
    },
    {
      "name": "Create Task",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{JWT_TOKEN}}"}
        ],
        "url": {"raw": "http://localhost:3000/api/tasks", "protocol": "http", "host": ["localhost"], "port": "3000", "path": ["api","tasks"]},
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Finish backend\",\n  \"description\": \"Complete the API\",\n  \"priority\": \"High\",\n  \"due_date\": \"2025-11-05\"\n}"
        }
      }
    },
    {
      "name": "Get Tasks",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{JWT_TOKEN}}"}],
        "url": {"raw": "http://localhost:3000/api/tasks", "protocol": "http", "host": ["localhost"], "port": "3000", "path": ["api","tasks"]}
      }
    },
    {
      "name": "Update Task",
      "request": {
        "method": "PATCH",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{JWT_TOKEN}}"}
        ],
        "url": {"raw": "http://localhost:3000/api/tasks/1", "protocol": "http", "host": ["localhost"], "port": "3000", "path": ["api","tasks","1"]},
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"Done\",\n  \"priority\": \"Medium\"\n}"
        }
      }
    },
    {
      "name": "Get Insights",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{JWT_TOKEN}}"}],
        "url": {"raw": "http://localhost:3000/api/insights", "protocol": "http", "host": ["localhost"], "port": "3000", "path": ["api","insights"]}
      }
    }
  ]
}


Replace {{JWT_TOKEN}} with the token you get from the login endpoint.

This addition ensures:

Your database is ready for immediate use.

You have Postman templates for testing all endpoints, including authentication.