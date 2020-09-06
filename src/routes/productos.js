const express = require('express');
const router = express.Router();
var crypto = require('crypto');

const pool = require('../lib/database');
const { isLoggedIn } = require('../lib/auth');


router.get('/', isLoggedIn, async (req, res) => {
    const dptos = await pool.query('SELECT * FROM departamentos WHERE dp_activo = ?', [1]);
    res.render('productos/list', { dptos });
});

router.get('/allprod', isLoggedIn, async (req, res) => {
    const prod = await pool.query('SELECT productos.*,precios.* FROM productos,precios WHERE precios.p_cod=productos.cod and productos.activo!=?', [0]);

    for (i = 0; i < prod.length; i++) {

        prod[i].option = "<div Class='text-center'><a class='btn btn-primary btn-sm fnEditProd' href='#' rl='" + prod[i].id + "'><i Class='fas fa-pencil-alt'></i></a><a class='btn btn-danger btn-sm fnDelProd' href='#' rl='" + prod[i].id + "'><i Class='fas fa-trash-alt'></i></a></div>"
    };
    res.send(JSON.stringify(prod));
});

router.post('/setProd', isLoggedIn, async (req, res) => {

    const form = req.body;
    var rows;
    var result = {};
    var imgName = "SinFoto.jpg";

    const objProd = {
        cod: form.cod,
        des: form.des,
        dpto: form.dpto,
        activo: form.activo,
        detalle: form.det,
        img: ""
    };

    const objPre = {
        p_cod: form.cod,
        preciod1: form.preciod1,
        preciod2: form.preciod2,
        precioy1: form.precioy1,
        precioy2: form.precioy2
    };


    if (form.idProd == 0) {

        if (req.files) {
            let avatar = req.files["ifoto"];
            avatar.name = crypto.createHash('md5').update(Date().toString()).digest("hex") + ".jpg"
            avatar.mv('./src/public/img/uploads/' + avatar.name);
            imgName = avatar.name;
        };

        objProd.img = imgName;

        rows = await pool.query('SELECT * FROM productos WHERE cod= ?', [objProd.cod]);
        if (rows.length > 0) {

            result = {
                status: false,
                msg: 'Codigo Producto ya Existe'
            }
        } else {

            rows = await pool.query('INSERT INTO productos set ?', [objProd]);
            rows = await pool.query('INSERT INTO precios set ?', [objPre]);

            if (rows.affectedRows == 1) {

                result = {
                    status: true,
                    msg: 'Producto Creado Correctamente'
                }
            };
        }
    } else {

        imgName = form.imgName;
        if (req.files) {

            let avatar = req.files["ifoto"];
            if (imgName != avatar.name) {

                if (imgName != 'SinFoto.jpg') {
                    var fs = require('fs');
                    fs.unlink('./src/public/img/uploads/' + imgName, (err) => {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                };

                avatar.name = crypto.createHash('md5').update(Date().toString()).digest("hex") + ".jpg"
                avatar.mv('./src/public/img/uploads/' + avatar.name);
                imgName = avatar.name;
            }

        } else {
            imgname = "SinFoto.jpg";
        };

        objProd.img = imgName;

        rows = await pool.query('UPDATE precios set ? WHERE p_cod= ?', [objPre, form.cod]);
        rows = await pool.query('UPDATE productos set ? WHERE id=?', [objProd, form.idProd]);

        if (rows.affectedRows == 1) {

            result = {
                status: true,
                msg: 'Producto Actualizado Correctamente'
            }
        } else {

            result = {
                status: false,
                msg: 'Error al Actualizar Producto'
            }
        }
    }

    res.send(JSON.stringify(result));

});

router.get('/getProd/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const rows = await pool.query('SELECT productos.*,precios.* FROM productos,precios WHERE productos.cod=precios.p_cod and productos.id = ?', id);

    result = rows[0];
    res.send(JSON.stringify(result));

});

router.delete('/delProd/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    var rows;
    var result = {};

    rows = await pool.query('SELECT cod,img FROM productos WHERE id = ?', [id]);
    const codPr = rows[0];

    rows = await pool.query('UPDATE precios SET p_activo=0 WHERE p_cod = ?', [codPr.cod]);

    rows = await pool.query('UPDATE productos SET activo=0 WHERE id = ?', [id]);

    if (rows.affectedRows == 1) {

        var fs = require('fs');
        fs.unlink('./src/public/img/uploads/' + codPr.img, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });

        result = {
            status: true,
            msg: 'Producto Borrado Correctamente'
        }
    } else {
        result = {
            status: false,
            msg: 'Error al Borrar Producto'
        }
    }
    res.send(JSON.stringify(result));

});

module.exports = router;