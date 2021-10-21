const express = require('express');
const app = express();
const port = 3000;

// Only serves the index.html file
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => console.log(`App listening at http://localhost:${port}`));
