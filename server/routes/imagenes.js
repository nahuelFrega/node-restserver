// Requires
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


app.get('/imagen/:entidad/:img', (req, res) => {

    let entidad = req.params.entidad;
    let img = req.params.img;

    let pathImg = `./uploads/${ entidad }/${ img }`;

    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

    res.sendFile(noImagePath);

});



module.exports = app;