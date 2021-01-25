require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Keyv = require('keyv');
const { NotFound } = require('./utills/Errors');
const errorHandler = require('./middleware/errorHandler');
const configurePassport = require('./config/passport');
const authRoute = require('./routes/auth');
const pokemonRoute = require('./routes/pokemon');
const path = require('path');
const { expressJWTK } = require('./middleware/security/express-jwtk');

const app = express();

const port = process.env.PORT || 9000;

const keyvClient = new Keyv();

if (process.env.NODE_ENV !== 'test') {
  const mongoDB = process.env.MONGODB_URI;
  mongoose
    .connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch(() => {
      process.exit(1);
    });
}

app.use(
  '/pokeapi/*',
  createProxyMiddleware({
    target: 'http://pokeapi.co/api/v2',
    pathRewrite: { '^/pokeapi': '' },
    changeOrigin: true
  })
);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(expressJWTK(keyvClient));
app.use(configurePassport());
app.use('/api/auth', authRoute);
app.use('/api/pokemon', pokemonRoute);
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
app.use('/api/*', (req, res, next) =>
  next(new NotFound('Route does not exist'))
);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
});

module.exports = app;
