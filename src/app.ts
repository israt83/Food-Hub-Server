import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { categoryRoutes } from "./modules/category/category.routes";
import { notFound } from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandle";
import { userRoute } from "./modules/user/user.routes";
import { providerRoute } from "./modules/provider/provider.routes";
import { mealRoute } from "./modules/meal/meal.routes";
import { reviewRoute } from "./modules/review/review.routes";
import { orderRoute } from "./modules/order/order.routes";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:4000",
  process.env.PROD_APP_URL,
  "https://food-hub-web.vercel.app",
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000",
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);


app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api", categoryRoutes);
app.use("/api", userRoute);
app.use("/api", providerRoute);
app.use("/api", mealRoute);
app.use("/api", orderRoute);
app.use("/api", reviewRoute);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
