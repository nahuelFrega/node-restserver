// ========================
//  Puerto
//  =======================
process.env.PORT = process.env.PORT || 8080;


// ========================
//  Entorno
//  =======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
//  Base de Datos
//  =======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = 'mongodb+srv://root:cbr3f100@cluster0-rkkfk.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.urlDB = urlDB;