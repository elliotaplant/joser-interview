// Tests for the DB
const DataBase = require('./db');

function expectEqual(actual, expected, errorMessage) {
  if (actual === expected) {
    console.log('Test passed');
  } else {
    console.error(errorMessage);
  }
}

async function testInitHandlesErrors() {
  let syncedState;

  function sync(state) {
    syncedState = state;
  }

  function load() {
    throw new Error('file not found');
  }

  const db = new DataBase(sync, load);
  await db.init();

  expectEqual(JSON.stringify(syncedState), JSON.stringify({
    users: {},
    tokens: {},
    usernames: {},
    todos: {},
  }), 'DB should init values if they are not present');
}

async function testCreateUser() {
  console.log('Add your test here');
}

testInitHandlesErrors();
testCreateUser();
