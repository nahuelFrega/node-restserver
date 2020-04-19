const jwt = require('jsonwebtoken');

// ====================
// Verifica el Token:
// Permite controlar las distintas acciones a partir de requerir un token válido 
// ====================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    // Valida el token
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token no válido'
            })
        }

        // Vuelca los datos 'decoded' a req.usuario
        req.usuario = decoded.usuario;
        next();

    });

};

// ====================
// Verifica AdminRol:
// Permite unicamente a los usuarios con rol 'ADMIN_ROLE' a realizar las acciones
// ====================
let verificaAdminRol = (req, res, next) => {

    let rol = req.usuario.role;

    if (rol === 'ADMIN_ROLE') {
        next();
        return
    }

    return res.status(401).json({
        ok: false,
        message: 'Permisos insuficientes'
    })

}



module.exports = {
    verificaToken,
    verificaAdminRol
};