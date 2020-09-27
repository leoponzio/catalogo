const express = require('express');
const router = express.Router();

const pool = require('../lib/database');
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    res.render('dpto/selDpto');
});

router.get('/selDpto', isLoggedIn, async (req, res) => {
    const dpto = await pool.query('SELECT * from departamentos WHERE dp_activo=?', [1]);

    for (i = 0; i < dpto.length; i++) {

        dpto[i].option = "<div Class='text-center'><a class='btn btn-primary btn-sm' href='catalogo/" + dpto[i].dp_cod + "' rl='" + dpto[i].dp_cod + "'><i class='far fa-check-square'></i></a></div>"
    };
    res.send(JSON.stringify(dpto));
});

module.exports = router;