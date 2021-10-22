const fs = require('fs').promises;
const DB_FILE = './db.json';

// JSON file persistance for the database
async function sync(state) {
  return fs.writeFile(DB_FILE, JSON.stringify(state, null, 2));
}

async function load() {
  return require(DB_FILE);
}

module.exports = {
  sync,
  load
};
