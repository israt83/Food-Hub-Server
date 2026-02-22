import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { categoryRoutes } from "./modules/category/category.routes";


const app = express();
app.use(express.json())
app.use(cors({
    origin: process.env.FROTEND_URL ,
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use('/api',categoryRoutes)





export default app