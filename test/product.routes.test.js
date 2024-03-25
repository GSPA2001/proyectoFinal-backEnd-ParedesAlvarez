// Para el test npx mocha test/*.test.js
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import Product from "../src/models/product.model.js";

describe("Product Router", () => {
  let productId;

  before(async () => {
    const newProduct = new Product({
      title: "Test Product",
      description: "This is a test product",
      price: 100,
      thumbnail: "https://ds6br8f5qp1u2.cloudfront.net/blog/wp-content/uploads/2021/03/7-Common-Types-of-Software-Testing@1x.png?x40138",
      code: "TEST123",
      category: "Extras",
      stock: 10,
    });
    const savedProduct = await newProduct.save();
    productId = savedProduct._id;
  });

  it("should return all products with status code 200", async () => {
    const response = await request(app)
      .get("/api/products")
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(response.body.status).to.equal("OK"); // Verifica el status de la respuesta
    expect(response.body.data).to.be.an("array"); // Verifica que data sea un array
  });

  it("should return a product by ID with status code 200", async () => {
    const response = await request(app)
      .get(`/api/products/${productId}`)
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(response.body.status).to.equal("OK"); // Verifica el status de la respuesta
    expect(response.body.data).to.have.property("_id"); // Verifica que data tenga _id
    expect(response.body.data).to.have.property("title");
    expect(response.body.data).to.have.property("price");
  });

});
