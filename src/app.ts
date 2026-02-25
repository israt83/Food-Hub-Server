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
app.use(express.json())
app.use(cors({
    origin: process.env.FROTEND_URL ,
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use('/api',categoryRoutes)
app.use('/api' , userRoute)
app.use('/api' , providerRoute)
app.use('/api', mealRoute)
app.use('/api' , orderRoute)
app.use('/api' , reviewRoute)


app.use(globalErrorHandler)
app.use(notFound)



export default app