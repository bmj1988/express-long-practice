const express = require('express');
require('express-async-errors');
const app = express();


app.use('/static', express.static('./assets'));
app.use(express.json());
const logFunc = (req, res, next) => {
  console.log(req.method, req.url)
  res.on('finish', () => {
    console.log(res.statusCode)
  })
  next()
}
app.use(logFunc)
// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.status(200).json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use((req, res, next) => {
  const newError = Error(`The requested resource couldn't be found.`)
  newError.status = 404;
  next(newError);
})
app.use((err, req, res, next) => {
res.status(err.status || 500).send(`${err.status} ${err.message}`);
})
const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
