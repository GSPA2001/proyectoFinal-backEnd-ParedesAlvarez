import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import passport from "passport"; 
import { uploader } from "../uploader.js";

const router = Router();
const controller = new UserController();

router.get("/", async (req, res) => {
  try {
    const users = await controller.getUsers();
    res.status(200).send({ status: "OK", data: users });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .send({ status: "ERR", message: "Error interno del servidor." });
  }
});

// Podemos modificar el método getUsersPaginated() del controlador
// para recibir parámetros que obtengamos aquí mediante req.params o req.query
// http://localhost:8080/api/users/paginated?limit=100&page=2&sort=desc
router.get("/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .send({
          status: "ERR",
          message: "Página no válida o parámetros de límite",
        });
    }

    const users = await controller.getUsersPaginated(page, limit);
    res.status(200).send({ status: "OK", data: users });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .send({ status: "ERR", message: "Error interno del servidor." });
  }
});

//Uso de faker, generalmente va por separado
//router.get('/mock/:qty([1-9]*)', async (req, res)=> {
router.get("/mock/:qty", async (req, res) => {
  try {
    const users = await controller.generateMockUsers(req.params.qty);
    res.status(200).send({ status: "OK", data: users });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

// Ruta para actualizar a un usuario a premium
router.get(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  controller.upgradeToPremium
);

// Ruta para subir documentos de un usuario
router.post(
  "/:uid/documents",
  passport.authenticate("jwt", { session: false }),
  uploader.single("file"),
  controller.uploadDocuments
);

export default router;