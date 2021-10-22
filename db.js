const fs = require('fs').promises;
const DB_FILE = './db.json';

// Fake instance of a database
let simpleJsonDb;
try {
  simpleJsonDb = require(DB_FILE);
} catch (e) {
  simpleJsonDb = {
    users: {},
    tokens: {},
    usernames: {},
    todos: {},
  };
  syncDb().catch(console.error());
}

// Writes the database to file
async function syncDb() {
  fs.writeFile(DB_FILE, JSON.stringify(simpleJsonDb, null, 2));
}

// Creates an ID for the user and stores the usernam and password in the DB
async function createUser(username, password) {
  const userId = Math.random() * 1e18;
  simpleJsonDb.users[userId] = { username, password };
  simpleJsonDb.usernames[username] = { userId, password };
  simpleJsonDb.todos[userId] = [];
  await syncDb();
  return userId;
}


// Checks to see if a username and password combo is in the DB
async function getUserId(username, enteredPassword) {
  const { userId, password: storedPasword } = simpleJsonDb.usernames[username];
  if (enteredPassword === storedPasword) {
    return userId;
  }
  throw new Error('Password did not match');
}

// Sets the session token for a user
async function setSessionToken(userId, sessionToken) {
  simpleJsonDb.tokens[userId] = sessionToken;
  await syncDb();
}

// Gets the list of all todos for a user
async function getTodos(userId) {
  return simpleJsonDb.todos[userId];
}

// Adds an uncompleted todo to the DB
async function addTodo(userId, name) {
  const todo = { name, completed: false };
  simpleJsonDb.todos[userId].push(todo);
  await syncDb();
  return todo;
}

// Toggles the completed state of a todo
async function toggleTodo(userId, name) {
  simpleJsonDb.todos[userId] = simpleJsonDb.todos[userId].map(todo => ({
    ...todo,
    completed: todo.name === name ? !todo.completed : todo.completed,
  }));
  const updatedTodo = simpleJsonDb.todos[userId].find(todo => todo.name === name);
  await syncDb();
  return updatedTodo;
}

module.exports = {
  createUser,
  setSessionToken,
  getUserId,
  getTodos,
  addTodo,
  toggleTodo,
};
