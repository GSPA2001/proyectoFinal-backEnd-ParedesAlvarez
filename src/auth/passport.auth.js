import passport from 'passport'
import LocalStrategy from 'passport-local'
import GithubStrategy from 'passport-github2'
import User from '../models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import config from '../config.js'

//console.log('config:', config);

const initPassport = () => {

    // Funcion para verificar el registro
    const verifyRegistration = async (req, username, password, done) => {
        try {
            const { first_name, last_name, email, age } = req.body;

            if (!first_name || !last_name || !email || !age) {
                return done('Se requiere first_name, last_name, email y gender en el body', false);
            }

            const user = await User.findOne({ email: username });

            if (user) {
                return done(null, false);
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            };

            const process = await User.create(newUser);

            return done(null, process);
        } catch (err) {
            return done(`Error passport local: ${err.message}`);
        }
    }

    const verifyLogin = async (req, username, password, done) => {
        const { mail, pass } = req.body;
    
        try {
            // Busco al usuario en la base de datos por su correo
            const usuario = await User.findOne({ email: mail });
    
            if (usuario && isValidPassword(usuario, pass)) {
                // Autenticación exitosa
                usuario.rol = 'ADMIN'
                await usuario.save()
                // Autenticación exitosa, llamamos a done con el usuario como segundo argumento
                return done(null, usuario);
            } else {
                // Datos no válidos
                return done(null, false, { message: 'Datos no válidos' });
            }
        } catch (err) {
            // Error en la búsqueda o verificación
            return done(err);
        }
    };

    //Funcion para verificar el registro con GitHub
    const verifyGithub = async (accessToken, refreshToken, profile, done) => {
        try {
            // Utilice profile._json.company ya que no lograba encontrar el email en el profile. Me devolvia el campo email: null.
            // Simplemente hago lo mismo que al registrar un usuario, y si esta registrado solo lo loguea como un user normal.
            const user = await User.findOne({ email: profile._json.company })

            if (!user) {
                const name_parts = profile._json.name.split(' ')
                const newUser = {
                    first_name: name_parts[0],
                    last_name: name_parts[1],
                    email: profile._json.company,
                    age: null,
                    password: ' '
                }
    
                const process = await User.create(newUser)
    
                return done(null, process)
            } else {
                done(null, user)
            }
        } catch (err) {
            return done(`Error passport Github: ${err.message}`)
        }
    }

    // Creamos una estrategia local de autenticacion para login
    passport.use('loginAuth', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'mail', // Campo en el formulario que contiene el nombre de usuario o correo electrónico
        passwordField: 'pass', // Campo en el formulario que contiene la contraseña
    }, verifyLogin));
    
    // Creamos estrategia local de autenticación para registro
    passport.use('registerAuth', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',      // Campo en el formulario que contiene el nombre de usuario o correo electrónico
        passwordField: 'password'    // Campo en el formulario que contiene la contraseña
    }, verifyRegistration))

    // Creamos estrategia para autenticación externa con Github
    passport.use('githubAuth', new GithubStrategy({
        clientID: config.githubAuth.clientId,
        clientSecret: config.githubAuth.clientSecret,
        callbackURL: config.githubAuth.callbackURL,
        passReqToCallback: true
    }, verifyGithub));
        
    // Métodos "helpers" de passport para manejo de datos de sesión
    // Son de uso interno de passport, normalmente no tendremos necesidad de tocarlos.
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
        
    passport.deserializeUser(async (id, done) => {
        try {
            done(null, await User.findById(id))
        } catch (err) {
            done(err.message)
        }
    })
}

export default initPassport