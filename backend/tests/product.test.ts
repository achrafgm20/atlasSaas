const request = require("supertest");
import app from "../app";
const { connect, close, clear } = require("../testUtils/setupTestDB");

let sellerToken: string;
let buyerToken: string;
let testProductId: string;

beforeAll(async () => await connect(), 15000);
afterAll(async () => await close());

describe("Product Routes", () => {
  // Setup before ALL tests - don't clear between tests in this suite
  beforeAll(async () => {
    // Register and login as Seller
    await request(app).post("/api/users/register").send({
      name: "Seller Hiba",
      email: "seller@gmail.com",
      role: "Seller",
      password: "12345679",
    });

    const sellerLogin = await request(app).post("/api/users/login").send({
      email: "seller@gmail.com",
      password: "12345679",
    });
    sellerToken = sellerLogin.body.token;

    // Register and login as Buyer
    await request(app).post("/api/users/register").send({
      name: "Buyer Ahmed",
      email: "buyer@gmail.com",
      role: "Buyer",
      password: "12345679",
    });

    const buyerLogin = await request(app).post("/api/users/login").send({
      email: "buyer@gmail.com",
      password: "12345679",
    });
    buyerToken = buyerLogin.body.token;
  }, 20000);

  // Clean up after all tests
  afterAll(async () => {
    await clear();
  });

  // Test 1: Create Product (Seller only)
  describe("POST /api/products/addProduct", () => {
    test("should create a product with valid seller token", async () => {
      const res = await request(app)
        .post("/api/products/addProduct")
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({
          productName: "iPhone 14 Pro",
          category: "Phone",
          condition: "Brand New",
          costPrice: 800,
          listingPrice: 1000,
          description: "Latest iPhone model",
          storage: "256GB",
          color: "Space Black",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("productName", "iPhone 14 Pro");
      expect(res.body).toHaveProperty("category", "Phone");
      expect(res.body).toHaveProperty("condition", "Brand New");
      expect(res.body).toHaveProperty("seller");
      
      // Save product ID for later tests
      testProductId = res.body._id;
    }, 10000);

    test("should reject product creation without required fields", async () => {
      const res = await request(app)
        .post("/api/products/addProduct")
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({
          productName: "iPhone 14",
          // Missing required fields
        });

      expect(res.statusCode).toBe(400);
    });

    test("should reject product creation by buyer", async () => {
      const res = await request(app)
        .post("/api/products/addProduct")
        .set("Authorization", `Bearer ${buyerToken}`)
        .send({
          productName: "iPhone 14",
          category: "Phone",
          condition: "Brand New",
          costPrice: 800,
          listingPrice: 1000,
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message", "Only sellers can create product");
    });

    test("should reject product creation without authentication", async () => {
      const res = await request(app)
        .post("/api/products/addProduct")
        .send({
          productName: "iPhone 14",
          category: "Phone",
          condition: "Brand New",
          costPrice: 800,
          listingPrice: 1000,
        });

      expect(res.statusCode).toBe(401);
    });
  });

  // Test 2: Get Seller's Products
  describe("GET /api/products/getSellerProduct", () => {
    test("should get seller's products", async () => {
      const res = await request(app)
        .get("/api/products/getSellerProduct")
        .set("Authorization", `Bearer ${sellerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("products");
      expect(res.body).toHaveProperty("pagination");
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBeGreaterThan(0);
    });

    test("should reject non-seller access", async () => {
      const res = await request(app)
        .get("/api/products/getSellerProduct")
        .set("Authorization", `Bearer ${buyerToken}`);

      expect(res.statusCode).toBe(403);
    });

    test("should support pagination", async () => {
      const res = await request(app)
        .get("/api/products/getSellerProduct?page=1&limit=5")
        .set("Authorization", `Bearer ${sellerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.pagination).toHaveProperty("currentPage", 1);
      expect(res.body.pagination).toHaveProperty("limit", 5);
    });
  });

  // Test 3: Get All Products (Public)
  describe("GET /api/products/getAllProducts", () => {
    test("should get all active products without authentication", async () => {
      const res = await request(app).get("/api/products/getAllProducts");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("products");
      expect(res.body).toHaveProperty("pagination");
    });

    test("should support pagination", async () => {
      const res = await request(app).get("/api/products/getAllProducts?page=1&limit=10");

      expect(res.statusCode).toBe(200);
      expect(res.body.pagination).toHaveProperty("currentPage", 1);
      expect(res.body.pagination).toHaveProperty("limit", 10);
    });
  });

  // Test 4: Filter Products (Seller)
  describe("GET /api/products/filterProductSeller", () => {
    beforeAll(async () => {
      // Create multiple products for filtering
      await request(app)
        .post("/api/products/addProduct")
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({
          productName: "iPhone 13",
          category: "Phone",
          condition: "Grade A",
          costPrice: 600,
          listingPrice: 800,
        });

      await request(app)
        .post("/api/products/addProduct")
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({
          productName: "MacBook Air",
          category: "Laptop",
          condition: "Brand New",
          costPrice: 1000,
          listingPrice: 1300,
        });
    }, 15000);

    test("should filter products by keyword", async () => {
      const res = await request(app)
        .get("/api/products/filterProductSeller?keyword=iPhone")
        .set("Authorization", `Bearer ${sellerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.products.length).toBeGreaterThan(0);
    });

    test("should filter products by category", async () => {
      const res = await request(app)
        .get("/api/products/filterProductSeller?category=Phone")
        .set("Authorization", `Bearer ${sellerToken}`);

      expect(res.statusCode).toBe(200);
    });

    test("should filter products by price range", async () => {
      const res = await request(app)
        .get("/api/products/filterProductSeller?minPrice=500&maxPrice=1000")
        .set("Authorization", `Bearer ${sellerToken}`);

      expect(res.statusCode).toBe(200);
    });
  });

  // Test 5: Filter Products (Client/Public)
  describe("GET /api/products/filterProductClient", () => {
    test("should filter products by keyword without auth", async () => {
      const res = await request(app).get("/api/products/filterProductClient?keyword=iPhone");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("products");
    });

    test("should filter by storage", async () => {
      const res = await request(app).get("/api/products/filterProductClient?storage=256GB");

      expect(res.statusCode).toBe(200);
    });

    test("should filter by condition (grade)", async () => {
      const res = await request(app).get("/api/products/filterProductClient?grade=Brand");

      expect(res.statusCode).toBe(200);
    });
  });

  // Test 6: Edit Product
  describe("PUT /api/products/editProdut/:id", () => {
    test("should edit product by seller", async () => {
      const res = await request(app)
        .put(`/api/products/editProdut/${testProductId}`)
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({
          productName: "iPhone 14 Pro Max",
          listingPrice: 1100,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.product).toHaveProperty("productName", "iPhone 14 Pro Max");
      expect(res.body.product).toHaveProperty("listingPrice", 1100);
    });

    test("should reject edit by non-seller", async () => {
      const res = await request(app)
        .put(`/api/products/editProdut/${testProductId}`)
        .set("Authorization", `Bearer ${buyerToken}`)
        .send({
          productName: "Updated Name",
        });

      expect(res.statusCode).toBe(403);
    });

    test("should return 404 for non-existent product", async () => {
      const res = await request(app)
        .put("/api/products/editProdut/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({
          productName: "Updated Name",
        });

      expect(res.statusCode).toBe(404);
    });
  });

  // Test 7: Get Product Details
  describe("GET /api/products/getProductDetails/:id", () => {
    test("should get product details by id", async () => {
      const res = await request(app).get(`/api/products/getProductDetails/${testProductId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("productName");
      expect(res.body).toHaveProperty("seller");
    });

    test("should return 404 for invalid product id", async () => {
      const res = await request(app).get("/api/products/getProductDetails/invalidid");

      expect(res.statusCode).toBe(404);
    });
  });

  // Test 8: Get Seller Details by Product
  describe("GET /api/products/getDetailsSeller/:productId", () => {
    test("should get seller details from product", async () => {
      const res = await request(app).get(`/api/products/getDetailsSeller/${testProductId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("email");
      expect(res.body).not.toHaveProperty("password");
    });
  });

  // Test 9: Delete Product
  describe("DELETE /api/products/deleteProduct/:id", () => {
    test("should delete product by seller", async () => {
      // Create a product specifically for deletion
      const createRes = await request(app)
        .post("/api/products/addProduct")
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({
          productName: "Product to Delete",
          category: "Phone",
          condition: "Fair",
          costPrice: 300,
          listingPrice: 400,
        });

      const productId = createRes.body._id;

      const res = await request(app)
        .delete(`/api/products/deleteProduct/${productId}`)
        .set("Authorization", `Bearer ${sellerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "product deleted succesfully with related images");

      // Verify product is deleted
      const checkRes = await request(app).get(`/api/products/getProductDetails/${productId}`);
      expect(checkRes.body).toBeNull();
    });

    test("should return 404 for non-existent product", async () => {
      const res = await request(app)
        .delete("/api/products/deleteProduct/507f1f77bcf86cd799439011")
        .set("Authorization", `Bearer ${sellerToken}`);

      expect(res.statusCode).toBe(404);
    });

    test("should reject deletion without auth", async () => {
      const res = await request(app).delete(`/api/products/deleteProduct/${testProductId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});