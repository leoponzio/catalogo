const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const jwt = require('jwt-simple');
const nodemailer = require('nodemailer');
const passport = require('passport');
const { isLoggedIn, inNotLoggedIn } = require('../lib/auth');
const pool = require('../lib/database');
const helpers = require('../lib/helpers');
const { email,ids } = require('../lib/config');
const { info } = require('console');
const SMTPTransport = require('nodemailer/lib/smtp-transport');
const { getMaxListeners } = require('process');


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
    u_email:form.email,
    u_clave:form.password
  };

  rows = await pool.query('SELECT * FROM usuarios WHERE u_usuario = ? or u_email=?', [newUser.u_usuario,newUser.u_email]);
  if (rows.length > 0) {

    result = {
      status: false,
      msg: 'El Usuario o Correo Ya Existe'
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

  const validPassword = await helpers.matchPassword(form.currentPassword, user.u_clave);

  if (validPassword) {

    if (form.newPassword === form.confirmPassword) {

      udpPass.u_clave = await helpers.encryptPassword(form.newPassword);

      rows = await pool.query("UPDATE usuarios SET ? WHERE u_id =?", [udpPass, user.u_id]);

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
        msg: 'La clave de Confirmacion no es Igual'
      }
    }
  } else {

    result = {
      status: false,
      msg: 'La contraseña actual es Incorrecta'
    }
  }


  res.send(JSON.stringify(result));

});

//olvido su clave

router.post('/forgotpass', inNotLoggedIn, async (req,res) =>{
      var result = {};
      var rows;
      var secret =  ids.secret;
      if (req.body.email !== undefined) {
        var emailAddress = req.body.email.toLowerCase();

        rows = await pool.query('SELECT * FROM usuarios WHERE u_email = ?', [emailAddress]);
        if (rows.length > 0) {
      
          var f1 = new Date();
         
          var payload = {
            id: rows[0].u_id,        // User ID from database
            email: emailAddress,
            time: f1.getTime()+(1000*60*60)

          };
         
          var token = jwt.encode(payload, secret);

          var transport = nodemailer.createTransport({
              service: email.service,
              auth:{
                user: email.email,
                pass: email.pass
              }              
          });
         
          var mailOption = {
            from: 'webmaster@deexpress.com',
            to: rows[0].u_email,
            subject: 'Restablecer Contraseña',
            html:'<a href="http://192.160.10.37:3500/resetpassword/'+ token + '">Reset password</a>',
          }

          transport.sendMail(mailOption, function(err,info){
            if (err){
              console.log(err);
            }
            
            result = {
              status: true,
              msg: 'Se ha enviado un enlace para Restablecer la Contraseña!'
            }
            res.send(JSON.stringify(result));
            console.log(info);

          });
          
        } else {
          result = {
            status: false,
            msg: 'El Correo no Existe, Verifique!'
          }
          res.send(JSON.stringify(result));
        }
      
      }
      
});

router.get('/resetpassword/:token', inNotLoggedIn, async (req,res) =>{
      var result = {};
      var rows;
      const { token } = req.params;

      var f1 = new Date();
      var secret =  ids.secret;
      
      var payload = jwt.decode(token, secret);

      if (f1.getTime() <= payload.time){

          rows = await pool.query('SELECT * FROM usuarios WHERE u_email = ?', [payload.email]);
          
          if (rows.length > 0) {

          var info = {
              token:token,
              id:payload.id
          };

          res.render('auth/resetPass',{info});
          }
      }else {
        res.redirect('/');
      }    
});

router.post('/resetpassword/:token', inNotLoggedIn, async (req,res) =>{
        var result = {};
        var form = req.body;
        var rows;
        const { token } = req.params;
        var secret =  ids.secret;
        

        if (form.password == form.confirmPassword){ 
                              
          var payload = jwt.decode(token, secret);

          rows = await pool.query('SELECT * FROM usuarios WHERE u_email = ?', [payload.email]);
          if (rows.length > 0) {

            var udpPass = await helpers.encryptPassword(form.password);

            rows = await pool.query("UPDATE usuarios SET  u_clave=? WHERE u_id =?", [udpPass, payload.id]);
            
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
          }
        }else {

          result = {
            status: false,
            msg: 'Error Las Claves no son Iguales'
          }
        }

        res.send(JSON.stringify(result)); 
       
});

module.exports = router;
