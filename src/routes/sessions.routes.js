import { Router } from "express";

import passport from "passport";
import User from "../models/user.model.js";
import initPassport from "../auth/passport.auth.js";

const router = Router();
initPassport();

//Creamos un pequeño middleware para una autorización básica
//Observar que aparece next, además de req y res.
// next nos permite continuar la secuencia de la "cadena".
// En este caso, si el usuario es admin, llamamos a next, caso contrario, devolvemos un error 403 (Forbidden), no se puede acceder al recurso.
// Si ni siquiera se dispone de req.session.user, directamente devolvemos error de no autorizado.
const auth = (req, res, next) => {
  try {
    if (req.session.user) {
      if (req.session.user.rol === "ADMIN") {
        next();
      } else {
        res.status(403).send({ status: "ERR", message: "Usuario no admin" });
      }
    } else {
      res.status(401).send({ status: "ERR", message: "Usuario no autorizado" });
    }
  } catch (err) {
    console.error("Error en auth middleware:", err);
    res
      .status(500)
      .send({ status: "ERR", message: "Error interno del servidor." });
  }
};

// Este endpoint es para testeo.
// Si es la primer visita desde esa instancia de navegador, req.session.visits no existirá, por ende se inicializará en 1 y se dará la bienvenida.
// En sucesivas visitas, ya estará disponible en req.session, por ende solo se lo incrementará.
// Continuará incrementando visita a visita hasta que caduque o se destruya la sesión.
router.get("/", async (req, res) => {
  try {
    // Verifico si hay al menos un usuario registrado
    const usuariosRegistrados = await User.find();

    if (usuariosRegistrados.length === 0) {
      // No hay usuarios registrados, redirige a la pagina de registro
      return res.redirect("/register");
    }

    // Si hay  registrados renderiza login
    res.redirect("/login");
  } catch (error) {
    console.error("Error en la ruta '/':", error);
    res
      .status(500)
      .send({ status: "ERR", message: "Error interno del servidor." });
  }
});

router.get("/logout", async (req, res) => {
  try {
    // req.session.destroy nos permite destruir la sesión
    // De esta forma, en la próxima solicitud desde ese mismo navegador, se iniciará desde cero, creando una nueva sesión y volviendo a almacenar los datos deseados.
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
        res
          .status(500)
          .send({ status: "ERR", message: "Error interno del servidor." });
      } else {
        // El endpoint puede retornar el mensaje de error, o directamente redireccionar a login o una página general.
        // res.status(200).send({ status: 'OK', data: 'Sesión finalizada' })
        res.redirect("/login");
      }
    });
  } catch (err) {
    console.error("Error en la ruta '/logout':", err);
    res
      .status(500)
      .send({ status: "ERR", message: "Error interno del servidor." });
  }
});

// Este es un endpoint "privado", solo visible para admin.
// Podemos ver que el contenido no realiza ninguna verificación, ya que la misma se hace inyectando el middleware auth en la cadena (ver definición auth arriba).
// Si todo va bien en auth, se llamará a next() y se continuará hasta aquí, caso contrario la misma rutina en auth() cortará y retornará la respuesta con el error correspondiente.
router.get("/admin", auth, async (req, res) => {
  try {
    res
      .status(200)
      .send({ status: "OK", message: "Estos son los datos privados." });
  } catch (err) {
    console.error("Error en la ruta '/admin':", err);
    res
      .status(500)
      .send({ status: "ERR", message: "Error interno del servidor." });
  }
});

// Ruta para verificar los fallos en el register
router.get("/failregister", async (req, res) => {
  res.status(400).send({
    status: "ERR",
    data: "El email ya existe o faltan datos obligatorios",
  });
});

router.get("/failauth", async (req, res) => {
  res.status(400).send({ status: "ERR", data: "Error en los campos enviados" });
});

router.get(
  "/github",
  passport.authenticate("githubAuth", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("githubAuth", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { email: req.user.email }, // Busco por mail y ->
        { $set: { rol: "ADMIN" } }, // actualizo el ROL segun quiera, hardcodeado.
        { new: true }
      );

      req.session.user = {
        email: req.user.email,
        rol: "ADMIN", //Asigno rol de ADMIN
      };

      res.redirect("/profile");
    } catch (error) {
      console.error("Error en la ruta '/githubcallback':", error);
      res.redirect("/login"); // Redirigir en caso de error
    }
  }
);

router.get("/current", (req, res) => {
  if (req.user) {
    const user = req.user;
    res
      .status(200)
      .send({ status: "OK", message: "Inicio de sesión exitoso", user });
  } else {
    res.redirect("/login");
  }
});

// Endpoint de login para autenticarse
router.post(
  "/login",
  passport.authenticate("loginAuth", {
    failureRedirect: "/api/sessions/failauth",
  }),
  async (req, res) => {
    try {
      res.redirect("/api/sessions/current"); //"/products"
    } catch (err) {
      res.status(500).send({ status: "ERR", data: err.message });
    }
  }
);

// Ruta para manejar el formulario de registro
router.post(
  "/register",
  passport.authenticate("registerAuth", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    try {
      res.status(200).send({ status: "OK", data: "Usuario registrado" });
    } catch (err) {
      res.status(500).send({ status: "ERR", data: err.message });
    }
  }
);

export default router;