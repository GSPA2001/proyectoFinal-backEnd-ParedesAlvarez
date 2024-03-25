// Para el test npx mocha test/*.test.js
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Session Router", () => {
  it("should redirect to login page when accessing root endpoint", async () => {
    const response = await request(app).get("/api/sessions");
    expect(response.status).to.equal(302);
    expect(response.header["location"]).to.equal("/login");
  });

  it("should logout the user and redirect to login page", async () => {
    const response = await request(app).get("/api/sessions/logout");
    expect(response.status).to.equal(302);
    expect(response.header["location"]).to.equal("/login");
  });

  it("should return unauthorized when accessing admin page without logging in", async () => {
    const response = await request(app).get("/api/sessions/admin");
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ status: "ERR", message: "Usuario no autorizado" });
  });

  it("should return unauthorized when accessing admin page with non-admin user", async () => {
    // Simulate a request to the admin endpoint without logging in
    const response = await request(app).get("/api/sessions/admin");
    
    // Check that the response status is 401 (Unauthorized)
    expect(response.status).to.equal(401);
    
    // Check the response body
    expect(response.body).to.deep.equal({ status: "ERR", message: "Usuario no autorizado" });
  });
});