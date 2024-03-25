import * as url from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import nodemailer from "nodemailer";
import config from "./config.js";

// Agrego catcher function here
export const catcher = (fn) => {
  return (req, res, next) => {
    fn(req, res).catch(err => next(err));
  };
}

const mailerService = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.GOOGLE_APP_EMAIL,
    pass: config.GOOGLE_APP_PASS,
  },
});

export const sendConfirmation = () => {
  return async (req, res, next) => {
    try {
      next();
      const subject = "CODERStore confirmación registro";
      const html = `<h1>CODERStore confirmación registro</h1>
        <p>Muchas gracias por registrarte ${req.user.first_name} ${req.user.last_name}!, te hemos dado de alta en nuestro sistema con el email ${req.user.email}</p>`;

      await mailerService.sendMail({
        from: config.GOOGLE_APP_EMAIL,
        to: req.user.email,
        subject: subject,
        html: html,
      });
      res.status(200).send({ status: "OK", data: "Email sent successfully" });
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        res
          .status(err.response.status)
          .send({ status: "ERR", data: err.response.data });
      } else {
        res.status(500).send({ status: "ERR", data: err.message });
      }
    }
  };
};

export const __filename = url.fileURLToPath(import.meta.url);

export const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const generateToken = (payload, duration) =>
  jwt.sign(payload, config.SECRET_KEY, { expiresIn: duration });

export const authToken = (req, res, next) => {
  const headerToken = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  const cookieToken =
    req.cookies && req.cookies["codertoken"]
      ? req.cookies["codertoken"]
      : undefined;
  const queryToken = req.query.access_token
    ? req.query.access_token
    : undefined;
  const receivedToken = headerToken || cookieToken || queryToken;

  if (!receivedToken) return res.redirect("/login");

  jwt.verify(receivedToken, config.SECRET_KEY, (err, credentials) => {
    if (err)
      return res.status(403).send({ status: "ERR", data: "No autorizado" });
    req.user = credentials;
    next();
  });
};

export const passportCall = (strategy, options) => {
  return async (req, res, next) => {
    try {
      passport.authenticate(strategy, options, (err, user, info) => {
        if (err) {
          throw err;
        }

        if (!user) {
          return res.status(401).send({
            status: "ERR",
            data: info.messages ? info.messages : info.toString(),
          });
        }

        req.user = user;
        next();
      })(req, res, next);
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", error: err.message });
    }
  };
};

export const listNumbers = (...numbers) => {
  numbers.forEach((number) => {
    if (isNaN(number)) {
      console.log("Invalid parameters");
      process.exit(-4);
    } else {
      console.log(number);
    }
  });
};

export const longExecutionFunction = () => {
  let result = 0;
  for (let i = 0; i < 3e9; i++) {
    result += i;
  }
  return result;
};