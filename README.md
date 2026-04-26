# ⚙️ FoodHub Backend | Modular Express & Prisma API

####  Live Url
https://food-hub-server-mu.vercel.app

####  Client code
https://github.com/israt83/Food-Hub-Client

##  Architecture & Design

This project follows a **Feature-Based Modular Architecture**. Instead of giant folders for all controllers or models, logic is grouped by domain (e.g., `meal`, `order`, `provider`), making the codebase intuitive and easy to navigate.

###  Technical Highlights

- **Express 5 (Beta):** Utilizing the latest features of Express for better asynchronous error handling.
- **Prisma ORM with pg-adapter:** Type-safe database interactions with optimized PostgreSQL connection pooling.
- **Better Auth:** Robust server-side session management and multi-role authentication.
- **Email Engine:** Automated order confirmations and verification flows via **Nodemailer**.

---

##  Core Modules

- **User & Auth:** Advanced account management and role-based access.
- **Meal & Category:** Comprehensive CRUD operations for a dynamic marketplace.
- **Order System:** Logic for handling customer requests and provider updates.
- **Provider Profiles:** Dedicated data isolation for marketplace sellers.
- **Review System:** Integrated customer feedback and rating engine.

---

## 🛠️ Tech Stack

| Layer          | Technology                           |
| :------------- | :----------------------------------- |
| **Runtime**    | Node.js (Target v20)                 |
| **Framework**  | Express.js 5                         |
| **Database**   | PostgreSQL with `@prisma/adapter-pg` |
| **ORM**        | Prisma v7.3.0                        |
| **Validation** | Zod                                  |
| **Build Tool** | tsup (High-speed bundling)           |

---

##  Project Structure

```text
src/
├── emails/             # Nodemailer templates (Order confirmations, etc.)
├── errors/             # Global AppError class & handling logic
├── middlewares/        # Auth guards, role checks, and global error handlers
├── modules/            # Domain-driven feature folders (Meal, Order, Review, etc.)
├── scripts/            # Database seeding scripts (seedMeals.ts, seedAdmin.ts)
├── utils/              # Core utilities like catchAsync and server config
└── server.ts           # Application entry point


```

⚙️ Installation & Setup
Clone & Install:

git clone https://github.com/israt83/Food-Hub-Server.git
npm install

Environment Configuration: Create a .env file with your DATABASE_URL and BETTER_AUTH_SECRET.

Database Setup:

```bash
npx prisma generate
npx prisma migrate dev
```

Seed Initial Data:

```bash
npm run seed:admin
npx tsx src/scripts/seedMeals.ts
```

Run Development Server:

```bash
npm run dev
```

