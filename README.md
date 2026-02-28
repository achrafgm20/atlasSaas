# AtlasSaaS

![AtlasSaaS Logo](frontend/src/assets/logoAtlas.png)

AtlasSaaS is a full-stack marketplace platform with:
- Buyer flows (browse products, cart, checkout, orders, favorites)
- Seller flows (product management, sales, notifications)
- Admin flows (users/sellers management, analytics)
- Real-time messaging and notifications (Socket.IO)

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB (Mongoose)
- Realtime: Socket.IO
- Integrations: Stripe, Cloudinary, Nodemailer
- Testing: Jest, Supertest, mongodb-memory-server
- Containerization: Docker, Docker Compose

## Repository Structure

`frontend/` - React + Vite client app  
`backend/` - Express + TypeScript API server  
`docker-compose.yml` - local multi-container setup

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or cloud)
- Stripe account (for checkout/onboarding)
- Cloudinary account (for image upload)

## Local Development

### 1) Install dependencies

```bash
# root (optional shared deps)
npm install

# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

### 2) Configure environment variables

Create `backend/.env`:

```env
# Server
PORT=4000
NODE_ENV=development
BACKEND_URL=http://localhost:4000
CLIENT_URL=http://localhost:5173

# Auth + DB
JWT_SECRET=your_jwt_secret
MONGO_URL=your_mongodb_connection_string

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer SMTP)
EMAIL_USER=you@example.com
EMAIL_PASS=your_email_password_or_app_password
```

Important: frontend API calls are currently hardcoded to `http://localhost:4000`, so backend should run on port `4000`.

### 3) Run the apps

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Default URLs:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`

## Docker

Run both services with Docker Compose:

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000`

## Scripts

Backend (`backend/package.json`):
- `npm run dev` - start backend with ts-node-dev
- `npm run build` - compile TypeScript to `dist/`
- `npm run start` - run compiled server
- `npm run test` - run Jest tests

Frontend (`frontend/package.json`):
- `npm run dev` - start Vite dev server
- `npm run build` - type-check and build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Main API Route Groups

- `/api/users`
- `/api/product`
- `/api/cart`
- `/api/favorite`
- `/api/discussion`
- `/api/checkout`
- `/api/orders`
- `/api/notification`
- `/api/trend`

## Testing

Run backend tests:

```bash
cd backend
npm test
```

## Notes

- CORS currently allows local origins including `http://localhost:5173`.
- Stripe webhooks are handled at `/api/checkout/webhook`.
- Images are uploaded through Cloudinary credentials defined in `backend/.env`.
