var crypto = require('crypto');

const slash = process.platform === 'win32' ? '\\' : '/';

var imgPath = "file:---" + process.cwd() + "-src-public-img-uploads-"; //"cssgPat1h = imgPath.replace(/-/g, slash);
imgPath = imgPath.replace(/-/g, slash);

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
        secret: crypto.createHash('md5').update('fe1a1915a379f3b-e5394b1506868106675-64d14794932-').digest("hex"),
        session:crypto.createHash('md5').update('catalogomysql').digest("hex"),
        port:3500
    },

    path:{
        slash:slash,
        PublicPath:'file:///'+process.cwd()+'/src/public',
        imgPath:imgPath
    }

    
};