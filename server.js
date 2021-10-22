const express = require('express');
const bodyParser = require('body-parser');
const DataBase = require('./db');
const ONE_HOUR_IN_MS = 1000 * 60 * 60;
const { sync, load } = require('./jsonPersist');

const app = express();

// Create the database
const db = new DataBase(sync, load);

// Only serves the index.html file
app.use(express.static('static'));
app.use(bodyParser.json());

// Route for users to sign up
app.post('/signup', async (req, res, next) => {
  try {
    const userId = await db.createUser(req.body.username, req.body.password);
    const sessionToken = createSessionToken();
    await db.setSessionToken(userId, sessionToken);
    res.type('json');
    res.send({ ...sessionToken, userId });
  } catch (e) {
    next(e);
  }
});

// Route for users to log in
app.post('/login', async (req, res, next) => {
  try {
    const userId = await db.getUserId(req.body.username, req.body.password);
    const sessionToken = createSessionToken();
    await db.setSessionToken(userId, sessionToken);
    res.type('json');
    res.send({ ...sessionToken, userId });
  } catch (e) {
    next(e);
  }
});

// Gets the list of all todos for a user
app.get('/todos/:userId', async (req, res, next) => {
  try {
    const todos = await db.getTodos(req.params.userId);
    res.type('json');
    res.send(todos);
  } catch (e) {
    next(e);
  }
});

// Adds an uncompleted todo to the DB
app.post('/todos/:userId', async (req, res, next) => {
  try {
    const todo = await db.addTodo(req.params.userId, req.body.name);
    res.type('json');
    res.send(todo);
  } catch (e) {
    next(e);
  }
});

// Toggles the completed state of a todo
app.put('/todos/:userId', async (req, res, next) => {
  try {
    const todo = await db.toggleTodo(req.params.userId, req.body.name);
    res.type('json');
    res.send(todo);
  } catch (e) {
    next(e);
  }
});

app.listen(3000, async () => {
  console.log('App listening at http://localhost:3000');
  await db.init();
  console.log('DB has been initialized');
});

function createSessionToken() {
  return {
    token: Math.random() * 1e18,
    expiresAt: new Date().valueOf() + ONE_HOUR_IN_MS
  };
}
