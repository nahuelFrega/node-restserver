const express = require('express');
const app = express();

// Declaración de routes
app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;