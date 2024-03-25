// Para el test npx mocha test/*.test.js
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import Cart from "../src/models/cart.model.js";

describe("Cart Router", () => {
  let cartId;

  before(async () => {
    const newCart = new Cart({
      products: ["65df0febb7dfbee91536be55", "65f0f068a8cf06892f010c40"],
      total: 9431.5,
    });
    const savedCart = await newCart.save();
    cartId = savedCart._id;
  });

  // comentado para evitar la eliminación de carritos total de mongo despues de cada prueba en cambio duplica el carrito no lo elimina
  // afterEach(async () => {
  //   await Cart.deleteMany({});
  // });

  it("should return all carts with status code 200", async () => {
    const response = await request(app)
      .get("/api/carts")
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(Array.isArray(response.body.carts)).to.be.true;
  });

  it("should return a cart by ID with status code 200", async () => {
    // Obtén el ID del carrito agregado anteriormente en la base de datos
    const carts = await Cart.find();
    const cartId = carts[0]._id;
  
    const response = await request(app)
      .get(`/api/carts/${cartId}`)
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(response.body.payload).to.have.property("_id");
  });

});
