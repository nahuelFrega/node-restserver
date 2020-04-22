// Requires
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


// default options
app.use(fileUpload());

// Instrucción put
app.put('/upload/:entidad/:id', function(req, res) {

    let entidad = req.params.entidad;
    let id = req.params.id;

    // Valida que se este cargando un archivo
    if (!req.files) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        })

    }

    // Valida la entidad que recibe por parámetros
    let entidadesValidas = ['productos', 'usuarios'];
    if (entidadesValidas.indexOf(entidad) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las entidades permitidas son: ' + entidadesValidas.join(', ')
            }
        })

    }

    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let file = req.files.archivo;
    // Obtiene el nombre y extension del archivo
    let nombreArchivo = file.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    // Valida que se importen solo las extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                extension
            }
        })

    }

    // Cambia el nombre del archivo para que sea único
    let milliSeconds = new Date().getMilliseconds();
    let fileName = `${ id }-${ milliSeconds }.${ extension }`;

    // Upload del archivo
    file.mv(`uploads/${ entidad }/${ fileName }`, (err) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        cargaImagen(id, res, fileName, entidad);

    });

});

// Carga la imagen al registro de la entidad
function cargaImagen(id, res, fileName, entidad) {

    let objeto;

    switch (entidad) {

        case 'usuarios':

            objeto = Usuario;
            break;

        case 'productos':

            objeto = Producto;
            break;

        default:

            borrarArchivo(fileName, entidad); // Se encarga de borrar el archivo previamente cargado
            return res.status(400).json({
                ok: false,
                err: {
                    message: `La entidad ${ entidad } no es válida`
                }
            });

    }

    objeto.findById(id, (err, registroDB) => {

        if (err) {
            borrarArchivo(fileName, entidad); // Se encarga de borrar el archivo previamente cargado
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Valida si existe el usuario
        if (!registroDB) {
            borrarArchivo(fileName, entidad); // Se encarga de borrar el archivo previamente cargado
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El registro no existe'
                }
            });
        }

        borrarArchivo(registroDB.img, entidad);
        guardarArchivoDB(fileName, res, registroDB, entidad);

    });

}

// Borrado de archivos
function borrarArchivo(archivoNombre, entidad) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ entidad }/${ archivoNombre }`);
    if (fs.existsSync(pathImagen)) {

        fs.unlinkSync(pathImagen);

    }

}

// Guardar archivo en el registro de DB
function guardarArchivoDB(archivoNombre, res, registroDB, entidad) {

    registroDB.img = archivoNombre;

    registroDB.save((err, registroGuardado) => {

        if (err) {

            borrarArchivo(archivoNombre, entidad); // Se encarga de borrar el archivo previamente cargado

            return res.status(500).json({
                ok: false,
                err
            })

        }

        res.json({
            ok: true,
            registro: registroGuardado,
            message: `Archivo subido con éxito! 2`
        });

    });

}


module.exports = app;