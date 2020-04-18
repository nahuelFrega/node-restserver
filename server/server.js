require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

// mongodb+srv://root:<password>@cluster0-rkkfk.mongodb.net/test

// Conexión DB
mongoose.connect(process.env.urlDB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${ err.message }`);
    });

mongoose.set('useCreateIndex', true);

// Listen
app.listen(process.env.PORT, () => {

    console.log(`Escuchando el puerto ${ process.env.PORT }`);

});