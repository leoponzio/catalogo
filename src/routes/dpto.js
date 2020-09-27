const express = require('express');
const router = express.Router();

const pool = require('../lib/database');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    res.render('dpto/list');
});

router.get('/alldpto', isLoggedIn, async (req, res) => {
    const dpto = await pool.query('SELECT * from departamentos WHERE dp_activo=?', [1]);

    for (i = 0; i < dpto.length; i++) {

        dpto[i].option = "<div Class='text-center'><a class='btn btn-primary btn-sm rounded-circle fnEditDp' href='#' rl='" + dpto[i].dp_id + "'><i Class='fas fa-pencil-alt'></i></a><a class='btn btn-danger btn-sm rounded-circle fnDelDp' href='#' rl='" + dpto[i].dp_id + "'><i Class='fas fa-trash-alt'></i></a></div>"
    };
    res.send(JSON.stringify(dpto));
});

router.post('/setDpto', isLoggedIn, async (req, res) => {
    const form = req.body;
    const objDpto = {
        dp_cod: form.cod,
        dp_des: form.des,
    };

    var rows;
    var result = {};

    if (form.idDpto == 0) {
        rows = await pool.query('SELECT * FROM departamentos WHERE dp_cod = ?', [objDpto.dp_cod]);

        if (rows.length > 0) {

            result = {
                status: false,
                msg: 'Codigo Departamento ya Existe'
            }
        } else {

            rows = await pool.query('INSERT INTO departamentos set ?', [objDpto]);

            if (rows.affectedRows == 1) {

                result = {
                    status: true,
                    msg: 'Departamento Creado Correctamente'
                }
            };
        }
    } else {

        rows = await pool.query('UPDATE departamentos set ? WHERE dp_id=?', [objDpto, form.idDpto]);

        if (rows.affectedRows == 1) {

            result = {
                status: true,
                msg: 'Departamento Actualizado Correctamente'
            }
        } else {

            result = {
                status: false,
                msg: 'Error al Actualizar Departamento'
            }
        }
    }
    res.send(JSON.stringify(result));
});

router.get('/getDpto/:id', async (req, res) => {
    const { id } = req.params;
    const rows = await pool.query('SELECT * FROM departamentos WHERE dp_id = ?', [id]);
    result = rows[0];
    res.send(JSON.stringify(result));
    //res.render('dpto/edit', { dpto: rows[0] });
});


router.delete('/delDpto/:id', async (req, res) => {
    const { id } = req.params;
    var rows;
    var result = {};

    rows = await pool.query('SELECT dp_cod FROM departamentos WHERE dp_id = ?', id);
    const codDp = rows[0];

    rows = await pool.query('SELECT * FROM productos WHERE dpto = ?', [codDp.dp_cod]);

    if (rows.length > 0) {

        result = {
            status: false,
            msg: 'No se puede borrar Deparamento asociado a Producto'
        }
    } else {
        rows = await pool.query('UPDATE departamentos SET dp_activo=0 WHERE dp_id = ?', id);

        if (rows.affectedRows == 1) {

            result = {
                status: true,
                msg: 'Departamento Borrado'
            }
        };
    }

    res.send(JSON.stringify(result));
});

module.exports = router;