import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";


const app = express();
app.use(cors({
    origin: process.env.FROTEND_URL ,
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));


app.use(express.json())


export default app