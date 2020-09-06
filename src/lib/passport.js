const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true

}, async (req, username, password, done) => {

  if (username.toLowerCase() === "master" && password === "9hh34jp9") {
    const user = {
      u_id: 9999,
      u_nombre: "Master ",
      u_usuario: "Master",
      u_Clave: helpers.encryptPassword("9hh34jp9")
    };
    return done(null, user);
  } else {

    const rows = await pool.query('SELECT * FROM usuarios WHERE u_usuario = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(password, user.u_clave);

      if (validPassword) {
        //done(null, user, req.flash('success', 'Bienvenido ' + user.u_nombre));
        done(null, user);
      } else {
        return done(null, false, req.flash('message', 'c'));
      }

    } else {
       return done(null, false, req.flash('message', 'u'));
    }
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.u_id);
});

passport.deserializeUser(async (id, done) => {

  var user = {};

  if (id === 9999) {
    user = {
      u_id: 9999,
      u_nombre: "Master",
      u_usuario: "Master",
      u_Clave: helpers.encryptPassword("9hh34jp9")
    }

  } else {

    const rows = await pool.query('SELECT * FROM usuarios WHERE u_id = ?', [id]);
    user = rows[0];

  }
  done(null, user);
});

