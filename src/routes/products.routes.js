import { Router } from "express";
import { uploader } from "../uploader.js";
import { ProductController } from "../controllers/product.controller.js";

const router = Router();
const controller = new ProductController();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Producto
 *     description: Devuelve todos los productos
 *     responses:
 *       200:
 *         description: Array de productos
*/
// http://localhost:8080/api/products?limit=50&page=2&sort=asc
router.get("/", async (req, res) => {
  try {
    const products = await controller.getProducts();
    res.status(200).send({ status: "OK", data: products });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

/**
 * @openapi
 * /api/products/{pid}:
 *   get:
 *     tags:
 *       - Producto
 *     description: Devuelve un producto específico por ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto a recuperar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del producto
 *       404:
 *         description: Producto no encontrado
*/

router.get("/:pid", async (req, res) => {
  try {
    const product = await controller.getProduct(req.params.pid);
    res.status(200).send({ status: "OK", data: product });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

/**
 * @openapi
 * /api/products/{pid}:
 *   put:
 *     tags:
 *       - Producto
 *     description: Actualiza un producto específico por ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Detalles del producto actualizado
 *       400:
 *         description: Solicitud incorrecta
 *       404:
 *         description: Producto no encontrado
*/

router.put("/:pid", uploader.single("thumbnail"), async (req, res) => {
  try {
    if (!req.file) {
      delete req.body.thumbnail;
    } else {
      req.body.thumbnail = req.file.filename;
    }

    const { title, description, price, code, stock } = req.body;
    if (!title || !description || !price || !code || !stock) {
      return res
        .status(400)
        .send({ status: "ERR", data: "Faltan campos obligatorios" });
    }

    const updatedProduct = await controller.updateProduct(
      req.params.pid,
      req.body
    );

    res.status(200).send({ status: "OK", data: updatedProduct });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Producto
 *     description: Agrega un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto agregado exitosamente
 *       400:
 *         description: Solicitud incorrecta
*/

router.post("/", uploader.single("thumbnail"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .send({ status: "FIL", data: "No se pudo subir el archivo" });

    const { title, description, price, code, stock } = req.body;
    if (!title || !description || !price || !code || !stock) {
      return res
        .status(400)
        .send({ status: "ERR", data: "Faltan campos obligatorios" });
    }

    const newContent = {
      title,
      description,
      price,
      thumbnail: req.file.filename,
      code,
      stock,
    };

    const result = await controller.addProduct(newContent);

    // Si deseamos emitir algún evento de socket.io, primero necesitamos
    // obtener el objeto que seteamos en app.js y luego hacer un emit()
    const socketServer = req.app.get("socketServer");

    res.status(200).send({ status: "OK", data: result });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.param("pid", async (req, res, next, pid) => {
  const regex = new RegExp(/^[a-fA-F0-9]{24}$/);
  if (regex.test(req.params.pid)) {
    next();
  } else {
    res.status(404).send({ status: "ERR", data: "Parámetro no válido" });
  }
});

export default router;