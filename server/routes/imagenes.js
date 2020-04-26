// Requires
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificaToken, verificaTokenImg } = require('../middlewares/authenticacion');


app.get('/imagen/:entidad/:img', verificaTokenImg, (req, res) => {

    let entidad = req.params.entidad;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${ entidad }/${ img }`);

    // Comprueba que exista el path. Por ende que exista la imagen que se esta buscando
    if (fs.existsSync(pathImagen)) {

        res.sendFile(pathImagen);

    } else {

        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);

    }

});


module.exports = app;