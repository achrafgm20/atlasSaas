// Set environment variables FIRST (before any imports)
process.env.JWT_SECRET = "testsecret";
process.env.STRIPE_SECRET_KEY = "sk_test_fakekey";
process.env.NODE_ENV = "test";

// Mock Stripe constructor
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    accounts: {
      create: jest.fn().mockResolvedValue({ 
        id: "acct_test123",
        details_submitted: true,
        capabilities: {
          transfers: "active",
          card_payments: "active"
        }
      }),
      retrieve: jest.fn().mockResolvedValue({
        id: "acct_test123",
        details_submitted: true,
        capabilities: {
          transfers: "active"
        }
      })
    },
    accountLinks: {
      create: jest.fn().mockResolvedValue({
        url: "https://fake-stripe-onboarding-url.com"
      })
    }
  }));
});

// Mock Cloudinary
jest.mock("../config/cloudinary", () => ({
  uploader: {
    upload_stream: (options: any, cb: any) => {
      cb(null, { 
        secure_url: "http://fake.url/image.jpg", 
        public_id: "fake_id" 
      });
      return { end: () => {} };
    },
    destroy: jest.fn().mockResolvedValue({ result: "ok" }),
  },
}));