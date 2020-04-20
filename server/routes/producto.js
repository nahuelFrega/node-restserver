// Require
const express = require('express');
const _ = require('underscore');
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/authenticacion');
const app = express();


// ==========================
// Crear nuevo producto
// 1- El token debe ser válido
// Grabar el usuario y categoria válida
// ==========================
app.post('/producto', verificaToken, (req, res) => {

    // Captura lo que viene desde el body
    let body = req.body;

    // Crea el objeto para almacenar ahi los datos del body que se deben guardar en la DB
    let producto = new Producto({

        nombre: body.nombre,
        descripcion: body.descripcion,
        precioU: body.precioU,
        categoria: body.categoria,
        usuario: req.usuario._id // Toma el ID de usuario del payload del token

    });

    // Guarda en la DB el nuevo registro, utilizando la función 'save' de mongoose
    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Validad si se creo el producto
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


// ==========================
// Obtener todos los productos
// 1- El token debe ser válido
// populate: usuario, categoria
// paginado
// ==========================
app.get('/producto', verificaToken, (req, res) => {

    // Definiciones para el paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Utiliza la función 'find' de mongoose para buscar todos los registros
    Producto.find()
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Cuenta la cantidad de registros con la función 'countDocuments'
            Producto.countDocuments()
                .skip(desde)
                .limit(limite)
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
                        productos
                    });

                })

        });

});


// ==========================
// Obtener producto por ID
// parametros: id
// 1- El token debe ser válido
// populate: usuario, categoria
// ==========================
app.get('/producto/:id', verificaToken, (req, res) => {

    // Toma por parametros el ID a buscar
    let id = req.params.id;

    // Utiliza 'findById' de mongoose para buscar un registro específico
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            // Valida si el producto existe
            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                })

            }

            res.json({
                ok: true,
                categoria: productoDB
            })

        });

});


// ==========================
// Obtener productos disponibles por nombre
// parametros: nombre
// 1- El token debe ser válido
// populate: categoria
// ==========================
app.get('/producto/buscar/:nombre', verificaToken, (req, res) => {

    // Toma por parametros el nombre
    let nombre = req.params.nombre;

    // Función de JS para convertir a expresión regular
    // El 'i' es para que no sea key-sensitive
    let regex = new RegExp(nombre, 'i');

    // Utiliza 'find' de mongoose para buscar un registro específico
    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            // Valida si el producto existe
            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                })

            }

            res.json({
                ok: true,
                categoria: productoDB
            })

        });

});


// ==========================
// Actualizar el producto
// parametros: id
// 1- El token debe ser válido
// ==========================
app.put('/producto/:id', verificaToken, (req, res) => {

    // Obtiene el ID por parámetro
    let id = req.params.id;

    // Obtiene los parametros enviados en el body
    let body = req.body;

    // Objeto de los parametros que se van a actualizar
    let toUpdate = {
        nombre: body.nombre
    }

    // Busca el ID y lo actualiza, función propia de mongoose
    Producto.findByIdAndUpdate(id, toUpdate, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Valida que el prodducto a modificar exista
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto que desea modificar no existe'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

});


// ==========================
// Desactivar un producto
// parametros: id
// 1- El token debe ser válido
// ==========================
app.delete('/producto/:id', verificaToken, (req, res) => {

    // Obtiene el ID por parámetro
    let id = req.params.id;

    // Define que se modifica en la colección
    let toDeactivate = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, toDeactivate, (err, productoInactivo) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Valida si existe el producto
        if (!productoInactivo) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto que desea desactivar no existe'
                }
            })
        }

        // Valida si el producto se encuentra inactivo
        if (productoInactivo.disponible === false) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto ya se encuentra sin disponibilidad'
                }
            })
        }

        res.json({
            ok: true,
            message: `El producto ${ id } se desactivó con éxito`
        })

    })

});


module.exports = app;