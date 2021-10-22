// DataBase class that carries internal state and can "sync" it to a persistance mechanism
class DataBase {
  constructor(sync, load) {
    this.sync = sync;
    this.load = load;
  }

  async init() {
    try {
      this.internalState = await this.load();
    } catch (e) {
      this.internalState = {
        users: {},
        tokens: {},
        usernames: {},
        todos: {},
      };
      this.sync(this.internalState);
    }
  }

  // Creates an ID for the user and stores the usernam and password in the DB
  async createUser(username, password) {
    const userId = Math.random() * 1e18;
    this.internalState.users[userId] = { username, password };
    this.internalState.usernames[username] = { userId, password };
    this.internalState.todos[userId] = [];
    await this.sync(this.internalState);
    return userId;
  }

  // Checks to see if a username and password combo is in the DB
  async getUserId(username, enteredPassword) {
    const { userId, password: storedPasword } = this.internalState.usernames[username];
    if (enteredPassword === storedPasword) {
      return userId;
    }
    throw new Error('Password did not match');
  }

  // Sets the session token for a user
  async setSessionToken(userId, sessionToken) {
    this.internalState.tokens[userId] = sessionToken;
    await this.sync(this.internalState);
  }

  // Gets the list of all todos for a user
  async getTodos(userId) {
    return this.internalState.todos[userId];
  }

  // Adds an uncompleted todo to the DB
  async addTodo(userId, name) {
    const todo = { name, completed: false };
    this.internalState.todos[userId].push(todo);
    await this.sync(this.internalState);
    return todo;
  }

  // Toggles the completed state of a todo
  async toggleTodo(userId, name) {
    this.internalState.todos[userId] = this.internalState.todos[userId].map(todo => ({
      ...todo,
      completed: todo.name === name ? !todo.completed : todo.completed,
    }));
    const updatedTodo = this.internalState.todos[userId].find(todo => todo.name === name);
    await this.sync(this.internalState);
    return updatedTodo;
  }
}

module.exports = DataBase;
