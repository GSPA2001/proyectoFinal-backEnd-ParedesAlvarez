import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs"; 
import { __dirname } from './utils.js';

// Define el middleware de Multer para subir archivos a carpetas específicas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/img`);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Crea el middleware de Multer con la configuración anterior
const uploader = multer({ storage });

// Define el middleware de Multer para subir documentos a carpetas basadas en el tipo MIME
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.resolve(
      __dirname,
      `../../uploads/${file.mimetype.split("/")[0]}`
    );
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err);
      const filename = `${hash.toString("hex")}-${file.originalname}`;
      cb(null, filename);
    });
  },
});

// Crea el middleware de Multer con la configuración para subir documentos
const uploadDocuments = multer({ storage: documentStorage }).fields([
  { name: "identification", maxCount: 1 },
  { name: "proofOfAddress", maxCount: 1 },
  { name: "proofOfAccountStatus", maxCount: 1 },
]);

export { uploader, uploadDocuments };