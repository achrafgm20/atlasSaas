const request = require("supertest");
import app from "../app";
const { connect, close, clear } = require("../testUtils/setupTestDB");

beforeAll(async () => await connect(), 10000);
afterAll(async () => await close());
afterEach(async () => await clear());

describe("Auth Route", () => {
  test("Register new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Hiba",
      email: "hiba@gmail.com",
      role: "Buyer",
      password: "12345679",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("hiba@gmail.com");
  });

  test("Login user", async () => {
    await request(app).post("/api/users/register").send({
      name: "Hiba",
      email: "hiba@gmail.com",
      role: "Buyer",
      password: "12345679",
    });

    const res = await request(app).post("/api/users/login").send({
      email: "hiba@gmail.com",
      password: "12345679",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.email).toBe("hiba@gmail.com");
  });

  test("Reject duplicate user", async () => {
    await request(app).post("/api/users/register").send({
      name: "Hiba",
      email: "hiba@gmail.com",
      role: "Buyer",
      password: "12345679",
    });

    const res = await request(app).post("/api/users/register").send({
      name: "Hiba",
      email: "hiba@gmail.com",
      role: "Buyer",
      password: "12345679",
    });

    expect(res.statusCode).toBe(400);
  });
});