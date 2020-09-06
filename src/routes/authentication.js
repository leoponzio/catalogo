const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, inNotLoggedIn } = require('../lib/auth');
const pool = require('../lib/database');
const helpers = require('../lib/helpers');



router.get('/signin', inNotLoggedIn, (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.post('/signin', inNotLoggedIn, (req, res, next) => {
  check('username', 'Username is Required').isLength({min:1});
  check('password', 'Password is Required').isLength({min:1});
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);

});


router.get('/logout', isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, async (req, res) => {
  var rows;
  
  rows = await pool.query('CALL dashboard()');
  
  rows =JSON.stringify(rows[0]);
  rows =JSON.parse(rows);

  res.render('profile', {info : rows[0]});
});


//crear usuario
router.post('/signup', isLoggedIn, async (req, res) => {
  var form = req.body;
  var rows;
  var result = {};

  const newUser = {
    u_nombre:form.fullname,
    u_usuario:form.username,
    u_clave:form.password
  };

  rows = await pool.query('SELECT * FROM usuarios WHERE u_usuario = ?', [newUser.u_usuario]);
  if (rows.length > 0) {

    result = {
      status: false,
      msg: 'El Usuario Y Existe'
    }

  } else {

    newUser.u_clave = await helpers.encryptPassword(newUser.u_clave);
    // Saving in the Database
    rows = await pool.query('INSERT INTO usuarios SET ? ', newUser);

    if (rows.affectedRows == 1) {

      result = {
        status: true,
        msg: 'Usuario Creado Correctamente'
      }

    }
  }
  res.send(JSON.stringify(result));

});

// cambio de clave
router.put('/pass', isLoggedIn, async (req, res) => {
  var form = req.body;
  var user = req.user;
  var udpPass = {};
  var result = {};

  const validPassword = await helpers.matchPassword(form.password, user.u_clave);

  if (validPassword) {

    if (form.password1 == form.password2) {

      udpPass.u_clave = await helpers.encryptPassword(form.password1);

      rows = await pool.query("UPDATE usuarios SET  u_clave=? WHERE u_id =?", [udpPass.u_clave, user.u_id]);

      if (rows.affectedRows == 1) {

        result = {
          status: true,
          msg: 'Clave Actualizada Correctamente'
        }

      } else {

        result = {
          status: false,
          msg: 'Error al Actualizar Clave'
        }
      }
    } else {
      result = {
        status: false,
        msg: 'La clave de confirmacion no es Igual'
      }
    }
  } else {

    result = {
      status: false,
      msg: 'La contraseña actual es incorrecta'
    }
  }


  res.send(JSON.stringify(result));

});

module.exports = router;
