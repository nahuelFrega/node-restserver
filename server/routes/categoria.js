// Require
const express = require('express');
const _ = require('underscore');
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRol } = require('../middlewares/authenticacion');
const app = express();


// ==========================
// Crea una nueva categoria
// 1- El token debe ser válido
// ==========================
app.post('/categoria', verificaToken, (req, res) => {

    // Captura lo que viene desde el body
    let body = req.body;

    // Crea el objeto para almacenar ahi los datos del body que se deben guardar en la DB
    let categoria = new Categoria({

        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id // Toma el ID de usuario del payload del token

    });

    // Guarda en la DB el nuevo registro, utilizando la función 'save' de mongoose
    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Validad si se creo al categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


// ==========================
// Mostrar la lista completa de categorias
// 1- El token debe ser válido
// ==========================
app.get('/categoria', verificaToken, (req, res) => {

    // Utiliza la función 'find' de mongoose para buscar todos los registros
    Categoria.find()
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Cuenta la cantidad de registros con la función 'countDocuments'
            Categoria.countDocuments()
                .exec((err, contador) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        cantidad: contador,
                        categorias
                    });

                })

        });

});


// ==========================
// Muestra solo una categorias 
// parametros: nombre
// 1- El token debe ser válido
// ==========================
app.get('/categoria/buscar/:nombre', verificaToken, (req, res) => {

    // Toma por parametros el nombre a buscar
    let nombreParam = req.params.nombre;

    // Utiliza 'findOne' de mongoose para buscar un registro específico
    Categoria.findOne({ nombre: nombreParam }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // Valida si la categoria existe
        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existe'
                }
            })

        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});


// ==========================
// Actualiza el nombre de la categoria
// parametros: id
// 1- El token debe ser válido
// ==========================
app.put('/categoria/:id', verificaToken, (req, res) => {

    // Obtiene el ID por parámetro
    let id = req.params.id;

    // Obtiene los parametros enviados en el body
    let body = req.body;

    // Objeto de los parametros que se van a actualizar
    let categoriaUpdate = {
        nombre: body.nombre
    }

    // Busca el ID y lo actualiza, función propia de mongoose
    Categoria.findByIdAndUpdate(id, categoriaUpdate, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Valida que la categoria a modificar exista
        if (categoriaDB === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria que desea modificar no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});


// ==========================
// Deshabilita una categoria
// parametros: id
// 1- El token debe ser válido
// 2- Solo un ADMIN_ROLE puede hacer este tipo de acciones
// ==========================
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {

    // Obtiene el ID por parámetro
    let id = req.params.id;

    // Define que se modifica en la colección
    let inactivaCategoria = {
        estado: false
    }

    Categoria.findByIdAndUpdate(id, inactivaCategoria, (err, categoriaInactiva) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Valida si existe la categoria
        if (!categoriaInactiva) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria que desea desactivar no existe'
                }
            })
        }

        // Valida si la categoria se encuentra inactiva
        if (categoriaInactiva.estado === false) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria ya se encuentra inactiva'
                }
            })
        }

        res.json({
            ok: true,
            message: `La categoria ${ id } se desactivó con éxito`
        })

    })

});


// Exports
module.exports = app;