var crypto = require('crypto');

module.exports = {

    database: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'db_catalogo'
    },

    email: {
        service: 'Gmail',
        email:'leoponzio1@gmail.com',
        pass:'sorckufmluvhqcmz'
    },

    ids:{
        secret: crypto.createHash('md5').update('fe1a1915a379f3b-e5394b1506868106675-64d14794932-').digest("hex")
    }

};