// ========================
//  Puerto
//  =======================
process.env.PORT = process.env.PORT || 8080;


// ========================
//  Entorno
//  =======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ========================
//  Vencimiento del token
//  =======================
process.env.CADUCIDAD_TOKEN = '48h';

// ========================
//  SEED de autenticación
//  =======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ========================
//  Base de Datos
//  =======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;


// ========================
//  Google Client ID
//  =======================
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '324056148425-1okgnee264sg5nl3fn12n9u3q3cctho4.apps.googleusercontent.com';