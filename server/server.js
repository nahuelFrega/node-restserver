require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Configuración global de rutas
app.use(require('./routes/index'));


// Conexión DB
mongoose.connect(process.env.urlDB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${ err.message }`);
    });

mongoose.set('useCreateIndex', true);


// Listen
app.listen(process.env.PORT, () => {

    console.log(`Escuchando el puerto ${ process.env.PORT }`);

});