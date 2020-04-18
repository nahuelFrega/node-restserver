const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    const condiciones = {
        estado: true
    }

    Usuario.find(condiciones, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments(condiciones)
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
                        usuarios
                    });

                });

        })

});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    usuario.save((err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    // Permite definir que elementos pueden ser editados
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let inactivaUsuario = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, inactivaUsuario, (err, usuarioDesactivado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (usuarioDesactivado.estado === false) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El Usuario ID ${ id } ya se encuentra inactivo`
                }
            });
        }

        res.json({
            ok: true,
            message: `Usuario ID: ${ id } se desactivó con éxito`
        });

    });

});


// Exports
module.exports = app;