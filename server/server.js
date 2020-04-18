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


// Conexión DB
mongoose.connect(`mongodb://localhost:27017/cafe`, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: $ { err.message }`);
    });

mongoose.set('useCreateIndex', true);

// Listen
app.listen(process.env.PORT, () => {

    console.log(`Escuchando el puerto ${ process.env.PORT }`);

});