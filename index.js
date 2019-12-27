const app = require('./app');
const generateData = require('./generator');
const PORT = process.env.PORT;

app.listen(PORT, function() {
  console.log('Listening for requests on port', PORT);
});

// setTimeout(generateData, 3000, 10);
