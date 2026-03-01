var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// prisma/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.0",
  "engineVersion": "ab56fe763f921d033a6c195e7ddeb3e255bdbb57",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum UserRole {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nmodel User {\n  id            String  @id @default(cuid())\n  name          String\n  email         String  @unique\n  emailVerified Boolean @default(false)\n  image         String?\n  phone         String?\n\n  role   UserRole?   @default(CUSTOMER)\n  status UserStatus? @default(ACTIVE)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  sessions        Session[]\n  accounts        Account[]\n  providerProfile ProviderProfile?\n  orders          Order[]          @relation("CustomerOrders")\n  reviews         Review[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id   String @id @default(uuid())\n  name String @unique\n  slug String @unique\n\n  meals Meal[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("category")\n}\n\nenum DietaryType {\n  VEGAN\n  VEGETARIAN\n  GLUTEN_FREE\n  HALAL\n  NONE\n}\n\nmodel Meal {\n  id          String      @id @default(uuid())\n  name        String\n  description String?\n  price       Float\n  imageUrl    String?\n  dietaryType DietaryType @default(NONE)\n  isAvailable Boolean     @default(true)\n\n  providerId String\n  categoryId String\n\n  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  category   Category        @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("meal")\n}\n\nmodel OrderItem {\n  id        String @id @default(uuid())\n  quantity  Int\n  mealName  String\n  mealPrice Float\n\n  orderId String\n  mealId  String\n\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal  Meal  @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([id])\n  @@map("order-item")\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  status          OrderStatus @default(PLACED)\n  totalPrice      Float\n  deliveryAddress String\n\n  customerId String\n  providerId String\n\n  customer User            @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Cascade)\n  provider ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n\n  items  OrderItem[]\n  review Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("order")\n}\n\nmodel ProviderProfile {\n  id             String  @id @default(uuid())\n  userId         String  @unique\n  restaurantName String\n  description    String?\n  address        String\n  phone          String\n  isOpen         Boolean @default(true)\n\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  meals  Meal[]\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("provider-profile")\n}\n\nmodel Review {\n  id      String  @id @default(uuid())\n  rating  Int\n  comment String?\n\n  orderId    String @unique\n  mealId     String\n  customerId String\n\n  order    Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal     Meal  @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  customer User  @relation(fields: [customerId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n\n  @@index([id])\n  @@map("review")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  // output   = "../src/generated/prisma"\n  output   = "../../prisma/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"category"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"dietaryType","kind":"enum","type":"DietaryType"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"meal"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"mealName","kind":"scalar","type":"String"},{"name":"mealPrice","kind":"scalar","type":"Float"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":"order-item"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"review","kind":"object","type":"Review","relationName":"OrderToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"order"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isOpen","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"provider-profile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"review"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","provider","meals","_count","category","customer","items","order","meal","review","orderItems","reviews","orders","providerProfile","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","_avg","_sum","Meal.groupBy","Meal.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","ProviderProfile.findUnique","ProviderProfile.findUniqueOrThrow","ProviderProfile.findFirst","ProviderProfile.findFirstOrThrow","ProviderProfile.findMany","ProviderProfile.createOne","ProviderProfile.createMany","ProviderProfile.createManyAndReturn","ProviderProfile.updateOne","ProviderProfile.updateMany","ProviderProfile.updateManyAndReturn","ProviderProfile.upsertOne","ProviderProfile.deleteOne","ProviderProfile.deleteMany","ProviderProfile.groupBy","ProviderProfile.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","comment","orderId","mealId","customerId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","userId","restaurantName","description","address","phone","isOpen","updatedAt","every","some","none","OrderStatus","status","totalPrice","deliveryAddress","providerId","quantity","mealName","mealPrice","name","price","imageUrl","DietaryType","dietaryType","isAvailable","categoryId","slug","identifier","value","expiresAt","accountId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","UserRole","role","UserStatus","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "iAVeoAESBAAAygIAIAUAAMsCACAQAADNAgAgEQAAqwIAIBIAAMwCACC7AQAAxwIAMLwBAAAtABC9AQAAxwIAML4BAQAAAAHEAUAAqAIAIdQBAQCmAgAh1gFAAKgCACHbAQAAyQL-ASPiAQEApQIAIfgBAQAAAAH5ASAApwIAIfoBAQCmAgAh_AEAAMgC_AEjAQAAAAEAIAwDAACpAgAguwEAAN4CADC8AQAAAwAQvQEAAN4CADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHWAUAAqAIAIewBQACoAgAh9QEBAKUCACH2AQEApgIAIfcBAQCmAgAhAwMAAMoDACD2AQAA3wIAIPcBAADfAgAgDAMAAKkCACC7AQAA3gIAMLwBAAADABC9AQAA3gIAML4BAQAAAAHEAUAAqAIAIdABAQClAgAh1gFAAKgCACHsAUAAqAIAIfUBAQAAAAH2AQEApgIAIfcBAQCmAgAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACpAgAguwEAANwCADC8AQAABwAQvQEAANwCADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHWAUAAqAIAId4BAQClAgAh7QEBAKUCACHuAQEApgIAIe8BAQCmAgAh8AEBAKYCACHxAUAA3QIAIfIBQADdAgAh8wEBAKYCACH0AQEApgIAIQgDAADKAwAg7gEAAN8CACDvAQAA3wIAIPABAADfAgAg8QEAAN8CACDyAQAA3wIAIPMBAADfAgAg9AEAAN8CACARAwAAqQIAILsBAADcAgAwvAEAAAcAEL0BAADcAgAwvgEBAAAAAcQBQACoAgAh0AEBAKUCACHWAUAAqAIAId4BAQClAgAh7QEBAKUCACHuAQEApgIAIe8BAQCmAgAh8AEBAKYCACHxAUAA3QIAIfIBQADdAgAh8wEBAKYCACH0AQEApgIAIQMAAAAHACABAAAIADACAAAJACAPAwAAqQIAIAcAAKoCACARAACrAgAguwEAAKQCADC8AQAACwAQvQEAAKQCADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHRAQEApQIAIdIBAQCmAgAh0wEBAKUCACHUAQEApQIAIdUBIACnAgAh1gFAAKgCACEBAAAACwAgEgYAANECACAJAADbAgAgDwAA0gIAIBAAAM0CACC7AQAA2QIAMLwBAAANABC9AQAA2QIAML4BAQClAgAhxAFAAKgCACHSAQEApgIAIdYBQACoAgAh3gEBAKUCACHiAQEApQIAIeMBCADQAgAh5AEBAKYCACHmAQAA2gLmASLnASAApwIAIegBAQClAgAhBgYAALwEACAJAADCBAAgDwAAvgQAIBAAAL0EACDSAQAA3wIAIOQBAADfAgAgEgYAANECACAJAADbAgAgDwAA0gIAIBAAAM0CACC7AQAA2QIAMLwBAAANABC9AQAA2QIAML4BAQAAAAHEAUAAqAIAIdIBAQCmAgAh1gFAAKgCACHeAQEApQIAIeIBAQClAgAh4wEIANACACHkAQEApgIAIeYBAADaAuYBIucBIACnAgAh6AEBAKUCACEDAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAANACALDAAA1gIAIA0AANcCACC7AQAA2AIAMLwBAAATABC9AQAA2AIAML4BAQClAgAhwQEBAKUCACHCAQEApQIAId8BAgDVAgAh4AEBAKUCACHhAQgA0AIAIQIMAADABAAgDQAAwQQAIAsMAADWAgAgDQAA1wIAILsBAADYAgAwvAEAABMAEL0BAADYAgAwvgEBAAAAAcEBAQClAgAhwgEBAKUCACHfAQIA1QIAIeABAQClAgAh4QEIANACACEDAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIA0KAACpAgAgDAAA1gIAIA0AANcCACC7AQAA1AIAMLwBAAAYABC9AQAA1AIAML4BAQClAgAhvwECANUCACHAAQEApgIAIcEBAQClAgAhwgEBAKUCACHDAQEApQIAIcQBQACoAgAhAQAAABgAIAEAAAATACAECgAAygMAIAwAAMAEACANAADBBAAgwAEAAN8CACANCgAAqQIAIAwAANYCACANAADXAgAguwEAANQCADC8AQAAGAAQvQEAANQCADC-AQEAAAABvwECANUCACHAAQEApgIAIcEBAQAAAAHCAQEApQIAIcMBAQClAgAhxAFAAKgCACEDAAAAGAAgAQAAGwAwAgAAHAAgAQAAABMAIAEAAAAYACAPBgAA0QIAIAoAAKkCACALAADSAgAgDgAA0wIAILsBAADOAgAwvAEAACAAEL0BAADOAgAwvgEBAKUCACHDAQEApQIAIcQBQACoAgAh1gFAAKgCACHbAQAAzwLbASLcAQgA0AIAId0BAQClAgAh3gEBAKUCACEEBgAAvAQAIAoAAMoDACALAAC-BAAgDgAAvwQAIA8GAADRAgAgCgAAqQIAIAsAANICACAOAADTAgAguwEAAM4CADC8AQAAIAAQvQEAAM4CADC-AQEAAAABwwEBAKUCACHEAUAAqAIAIdYBQACoAgAh2wEAAM8C2wEi3AEIANACACHdAQEApQIAId4BAQClAgAhAwAAACAAIAEAACEAMAIAACIAIAEAAAANACABAAAAIAAgAwAAACAAIAEAACEAMAIAACIAIAMAAAAYACABAAAbADACAAAcACABAAAAAwAgAQAAAAcAIAEAAAAgACABAAAAGAAgAQAAAAEAIBIEAADKAgAgBQAAywIAIBAAAM0CACARAACrAgAgEgAAzAIAILsBAADHAgAwvAEAAC0AEL0BAADHAgAwvgEBAKUCACHEAUAAqAIAIdQBAQCmAgAh1gFAAKgCACHbAQAAyQL-ASPiAQEApQIAIfgBAQClAgAh-QEgAKcCACH6AQEApgIAIfwBAADIAvwBIwkEAAC6BAAgBQAAuwQAIBAAAL0EACARAADMAwAgEgAAvAQAINQBAADfAgAg2wEAAN8CACD6AQAA3wIAIPwBAADfAgAgAwAAAC0AIAEAAC4AMAIAAAEAIAMAAAAtACABAAAuADACAAABACADAAAALQAgAQAALgAwAgAAAQAgDwQAALUEACAFAAC2BAAgEAAAuQQAIBEAALgEACASAAC3BAAgvgEBAAAAAcQBQAAAAAHUAQEAAAAB1gFAAAAAAdsBAAAA_gED4gEBAAAAAfgBAQAAAAH5ASAAAAAB-gEBAAAAAfwBAAAA_AEDARgAADIAIAq-AQEAAAABxAFAAAAAAdQBAQAAAAHWAUAAAAAB2wEAAAD-AQPiAQEAAAAB-AEBAAAAAfkBIAAAAAH6AQEAAAAB_AEAAAD8AQMBGAAANAAwARgAADQAMA8EAACBBAAgBQAAggQAIBAAAIUEACARAACEBAAgEgAAgwQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMCAAAAAQAgGAAANwAgCr4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMCAAAALQAgGAAAOQAgAgAAAC0AIBgAADkAIAMAAAABACAfAAAyACAgAAA3ACABAAAAAQAgAQAAAC0AIAcIAAD8AwAgJQAA_gMAICYAAP0DACDUAQAA3wIAINsBAADfAgAg-gEAAN8CACD8AQAA3wIAIA27AQAAwAIAMLwBAABAABC9AQAAwAIAML4BAQCSAgAhxAFAAJUCACHUAQEAlAIAIdYBQACVAgAh2wEAAMIC_gEj4gEBAJICACH4AQEAkgIAIfkBIAChAgAh-gEBAJQCACH8AQAAwQL8ASMDAAAALQAgAQAAPwAwJAAAQAAgAwAAAC0AIAEAAC4AMAIAAAEAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAAPsDACC-AQEAAAABxAFAAAAAAdABAQAAAAHWAUAAAAAB7AFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAQEYAABIACAIvgEBAAAAAcQBQAAAAAHQAQEAAAAB1gFAAAAAAewBQAAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAEBGAAASgAwARgAAEoAMAkDAAD6AwAgvgEBAOUCACHEAUAA6AIAIdABAQDlAgAh1gFAAOgCACHsAUAA6AIAIfUBAQDlAgAh9gEBAOcCACH3AQEA5wIAIQIAAAAFACAYAABNACAIvgEBAOUCACHEAUAA6AIAIdABAQDlAgAh1gFAAOgCACHsAUAA6AIAIfUBAQDlAgAh9gEBAOcCACH3AQEA5wIAIQIAAAADACAYAABPACACAAAAAwAgGAAATwAgAwAAAAUAIB8AAEgAICAAAE0AIAEAAAAFACABAAAAAwAgBQgAAPcDACAlAAD5AwAgJgAA-AMAIPYBAADfAgAg9wEAAN8CACALuwEAAL8CADC8AQAAVgAQvQEAAL8CADC-AQEAkgIAIcQBQACVAgAh0AEBAJICACHWAUAAlQIAIewBQACVAgAh9QEBAJICACH2AQEAlAIAIfcBAQCUAgAhAwAAAAMAIAEAAFUAMCQAAFYAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAAD2AwAgvgEBAAAAAcQBQAAAAAHQAQEAAAAB1gFAAAAAAd4BAQAAAAHtAQEAAAAB7gEBAAAAAe8BAQAAAAHwAQEAAAAB8QFAAAAAAfIBQAAAAAHzAQEAAAAB9AEBAAAAAQEYAABeACANvgEBAAAAAcQBQAAAAAHQAQEAAAAB1gFAAAAAAd4BAQAAAAHtAQEAAAAB7gEBAAAAAe8BAQAAAAHwAQEAAAAB8QFAAAAAAfIBQAAAAAHzAQEAAAAB9AEBAAAAAQEYAABgADABGAAAYAAwDgMAAPUDACC-AQEA5QIAIcQBQADoAgAh0AEBAOUCACHWAUAA6AIAId4BAQDlAgAh7QEBAOUCACHuAQEA5wIAIe8BAQDnAgAh8AEBAOcCACHxAUAA9AMAIfIBQAD0AwAh8wEBAOcCACH0AQEA5wIAIQIAAAAJACAYAABjACANvgEBAOUCACHEAUAA6AIAIdABAQDlAgAh1gFAAOgCACHeAQEA5QIAIe0BAQDlAgAh7gEBAOcCACHvAQEA5wIAIfABAQDnAgAh8QFAAPQDACHyAUAA9AMAIfMBAQDnAgAh9AEBAOcCACECAAAABwAgGAAAZQAgAgAAAAcAIBgAAGUAIAMAAAAJACAfAABeACAgAABjACABAAAACQAgAQAAAAcAIAoIAADxAwAgJQAA8wMAICYAAPIDACDuAQAA3wIAIO8BAADfAgAg8AEAAN8CACDxAQAA3wIAIPIBAADfAgAg8wEAAN8CACD0AQAA3wIAIBC7AQAAuwIAMLwBAABsABC9AQAAuwIAML4BAQCSAgAhxAFAAJUCACHQAQEAkgIAIdYBQACVAgAh3gEBAJICACHtAQEAkgIAIe4BAQCUAgAh7wEBAJQCACHwAQEAlAIAIfEBQAC8AgAh8gFAALwCACHzAQEAlAIAIfQBAQCUAgAhAwAAAAcAIAEAAGsAMCQAAGwAIAMAAAAHACABAAAIADACAAAJACAJuwEAALoCADC8AQAAcgAQvQEAALoCADC-AQEAAAABxAFAAKgCACHWAUAAqAIAIeoBAQClAgAh6wEBAKUCACHsAUAAqAIAIQEAAABvACABAAAAbwAgCbsBAAC6AgAwvAEAAHIAEL0BAAC6AgAwvgEBAKUCACHEAUAAqAIAIdYBQACoAgAh6gEBAKUCACHrAQEApQIAIewBQACoAgAhAAMAAAByACABAABzADACAABvACADAAAAcgAgAQAAcwAwAgAAbwAgAwAAAHIAIAEAAHMAMAIAAG8AIAa-AQEAAAABxAFAAAAAAdYBQAAAAAHqAQEAAAAB6wEBAAAAAewBQAAAAAEBGAAAdwAgBr4BAQAAAAHEAUAAAAAB1gFAAAAAAeoBAQAAAAHrAQEAAAAB7AFAAAAAAQEYAAB5ADABGAAAeQAwBr4BAQDlAgAhxAFAAOgCACHWAUAA6AIAIeoBAQDlAgAh6wEBAOUCACHsAUAA6AIAIQIAAABvACAYAAB8ACAGvgEBAOUCACHEAUAA6AIAIdYBQADoAgAh6gEBAOUCACHrAQEA5QIAIewBQADoAgAhAgAAAHIAIBgAAH4AIAIAAAByACAYAAB-ACADAAAAbwAgHwAAdwAgIAAAfAAgAQAAAG8AIAEAAAByACADCAAA7gMAICUAAPADACAmAADvAwAgCbsBAAC5AgAwvAEAAIUBABC9AQAAuQIAML4BAQCSAgAhxAFAAJUCACHWAUAAlQIAIeoBAQCSAgAh6wEBAJICACHsAUAAlQIAIQMAAAByACABAACEAQAwJAAAhQEAIAMAAAByACABAABzADACAABvACAJBwAAqgIAILsBAAC4AgAwvAEAAIsBABC9AQAAuAIAML4BAQAAAAHEAUAAqAIAIdYBQACoAgAh4gEBAAAAAekBAQAAAAEBAAAAiAEAIAEAAACIAQAgCQcAAKoCACC7AQAAuAIAMLwBAACLAQAQvQEAALgCADC-AQEApQIAIcQBQACoAgAh1gFAAKgCACHiAQEApQIAIekBAQClAgAhAQcAAMsDACADAAAAiwEAIAEAAIwBADACAACIAQAgAwAAAIsBACABAACMAQAwAgAAiAEAIAMAAACLAQAgAQAAjAEAMAIAAIgBACAGBwAA7QMAIL4BAQAAAAHEAUAAAAAB1gFAAAAAAeIBAQAAAAHpAQEAAAABARgAAJABACAFvgEBAAAAAcQBQAAAAAHWAUAAAAAB4gEBAAAAAekBAQAAAAEBGAAAkgEAMAEYAACSAQAwBgcAAOMDACC-AQEA5QIAIcQBQADoAgAh1gFAAOgCACHiAQEA5QIAIekBAQDlAgAhAgAAAIgBACAYAACVAQAgBb4BAQDlAgAhxAFAAOgCACHWAUAA6AIAIeIBAQDlAgAh6QEBAOUCACECAAAAiwEAIBgAAJcBACACAAAAiwEAIBgAAJcBACADAAAAiAEAIB8AAJABACAgAACVAQAgAQAAAIgBACABAAAAiwEAIAMIAADgAwAgJQAA4gMAICYAAOEDACAIuwEAALcCADC8AQAAngEAEL0BAAC3AgAwvgEBAJICACHEAUAAlQIAIdYBQACVAgAh4gEBAJICACHpAQEAkgIAIQMAAACLAQAgAQAAnQEAMCQAAJ4BACADAAAAiwEAIAEAAIwBADACAACIAQAgAQAAAA8AIAEAAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACAPBgAA3wMAIAkAAMQDACAPAADFAwAgEAAAxgMAIL4BAQAAAAHEAUAAAAAB0gEBAAAAAdYBQAAAAAHeAQEAAAAB4gEBAAAAAeMBCAAAAAHkAQEAAAAB5gEAAADmAQLnASAAAAAB6AEBAAAAAQEYAACmAQAgC74BAQAAAAHEAUAAAAAB0gEBAAAAAdYBQAAAAAHeAQEAAAAB4gEBAAAAAeMBCAAAAAHkAQEAAAAB5gEAAADmAQLnASAAAAAB6AEBAAAAAQEYAACoAQAwARgAAKgBADAPBgAA3gMAIAkAAKkDACAPAACqAwAgEAAAqwMAIL4BAQDlAgAhxAFAAOgCACHSAQEA5wIAIdYBQADoAgAh3gEBAOUCACHiAQEA5QIAIeMBCACBAwAh5AEBAOcCACHmAQAApwPmASLnASAA8gIAIegBAQDlAgAhAgAAAA8AIBgAAKsBACALvgEBAOUCACHEAUAA6AIAIdIBAQDnAgAh1gFAAOgCACHeAQEA5QIAIeIBAQDlAgAh4wEIAIEDACHkAQEA5wIAIeYBAACnA-YBIucBIADyAgAh6AEBAOUCACECAAAADQAgGAAArQEAIAIAAAANACAYAACtAQAgAwAAAA8AIB8AAKYBACAgAACrAQAgAQAAAA8AIAEAAAANACAHCAAA2QMAICUAANwDACAmAADbAwAgdwAA2gMAIHgAAN0DACDSAQAA3wIAIOQBAADfAgAgDrsBAACzAgAwvAEAALQBABC9AQAAswIAML4BAQCSAgAhxAFAAJUCACHSAQEAlAIAIdYBQACVAgAh3gEBAJICACHiAQEAkgIAIeMBCACuAgAh5AEBAJQCACHmAQAAtALmASLnASAAoQIAIegBAQCSAgAhAwAAAA0AIAEAALMBADAkAAC0AQAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAVACABAAAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgCAwAAMIDACANAACYAwAgvgEBAAAAAcEBAQAAAAHCAQEAAAAB3wECAAAAAeABAQAAAAHhAQgAAAABARgAALwBACAGvgEBAAAAAcEBAQAAAAHCAQEAAAAB3wECAAAAAeABAQAAAAHhAQgAAAABARgAAL4BADABGAAAvgEAMAgMAADAAwAgDQAAlgMAIL4BAQDlAgAhwQEBAOUCACHCAQEA5QIAId8BAgDmAgAh4AEBAOUCACHhAQgAgQMAIQIAAAAVACAYAADBAQAgBr4BAQDlAgAhwQEBAOUCACHCAQEA5QIAId8BAgDmAgAh4AEBAOUCACHhAQgAgQMAIQIAAAATACAYAADDAQAgAgAAABMAIBgAAMMBACADAAAAFQAgHwAAvAEAICAAAMEBACABAAAAFQAgAQAAABMAIAUIAADUAwAgJQAA1wMAICYAANYDACB3AADVAwAgeAAA2AMAIAm7AQAAsgIAMLwBAADKAQAQvQEAALICADC-AQEAkgIAIcEBAQCSAgAhwgEBAJICACHfAQIAkwIAIeABAQCSAgAh4QEIAK4CACEDAAAAEwAgAQAAyQEAMCQAAMoBACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAACIAIAEAAAAiACADAAAAIAAgAQAAIQAwAgAAIgAgAwAAACAAIAEAACEAMAIAACIAIAMAAAAgACABAAAhADACAAAiACAMBgAA0wMAIAoAAJoDACALAACbAwAgDgAAnAMAIL4BAQAAAAHDAQEAAAABxAFAAAAAAdYBQAAAAAHbAQAAANsBAtwBCAAAAAHdAQEAAAAB3gEBAAAAAQEYAADSAQAgCL4BAQAAAAHDAQEAAAABxAFAAAAAAdYBQAAAAAHbAQAAANsBAtwBCAAAAAHdAQEAAAAB3gEBAAAAAQEYAADUAQAwARgAANQBADAMBgAA0gMAIAoAAIMDACALAACEAwAgDgAAhQMAIL4BAQDlAgAhwwEBAOUCACHEAUAA6AIAIdYBQADoAgAh2wEAAIAD2wEi3AEIAIEDACHdAQEA5QIAId4BAQDlAgAhAgAAACIAIBgAANcBACAIvgEBAOUCACHDAQEA5QIAIcQBQADoAgAh1gFAAOgCACHbAQAAgAPbASLcAQgAgQMAId0BAQDlAgAh3gEBAOUCACECAAAAIAAgGAAA2QEAIAIAAAAgACAYAADZAQAgAwAAACIAIB8AANIBACAgAADXAQAgAQAAACIAIAEAAAAgACAFCAAAzQMAICUAANADACAmAADPAwAgdwAAzgMAIHgAANEDACALuwEAAKwCADC8AQAA4AEAEL0BAACsAgAwvgEBAJICACHDAQEAkgIAIcQBQACVAgAh1gFAAJUCACHbAQAArQLbASLcAQgArgIAId0BAQCSAgAh3gEBAJICACEDAAAAIAAgAQAA3wEAMCQAAOABACADAAAAIAAgAQAAIQAwAgAAIgAgDwMAAKkCACAHAACqAgAgEQAAqwIAILsBAACkAgAwvAEAAAsAEL0BAACkAgAwvgEBAAAAAcQBQACoAgAh0AEBAAAAAdEBAQClAgAh0gEBAKYCACHTAQEApQIAIdQBAQClAgAh1QEgAKcCACHWAUAAqAIAIQEAAADjAQAgAQAAAOMBACAEAwAAygMAIAcAAMsDACARAADMAwAg0gEAAN8CACADAAAACwAgAQAA5gEAMAIAAOMBACADAAAACwAgAQAA5gEAMAIAAOMBACADAAAACwAgAQAA5gEAMAIAAOMBACAMAwAAxwMAIAcAAMgDACARAADJAwAgvgEBAAAAAcQBQAAAAAHQAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBIAAAAAHWAUAAAAABARgAAOoBACAJvgEBAAAAAcQBQAAAAAHQAQEAAAAB0QEBAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBIAAAAAHWAUAAAAABARgAAOwBADABGAAA7AEAMAwDAADzAgAgBwAA9AIAIBEAAPUCACC-AQEA5QIAIcQBQADoAgAh0AEBAOUCACHRAQEA5QIAIdIBAQDnAgAh0wEBAOUCACHUAQEA5QIAIdUBIADyAgAh1gFAAOgCACECAAAA4wEAIBgAAO8BACAJvgEBAOUCACHEAUAA6AIAIdABAQDlAgAh0QEBAOUCACHSAQEA5wIAIdMBAQDlAgAh1AEBAOUCACHVASAA8gIAIdYBQADoAgAhAgAAAAsAIBgAAPEBACACAAAACwAgGAAA8QEAIAMAAADjAQAgHwAA6gEAICAAAO8BACABAAAA4wEAIAEAAAALACAECAAA7wIAICUAAPECACAmAADwAgAg0gEAAN8CACAMuwEAAKACADC8AQAA-AEAEL0BAACgAgAwvgEBAJICACHEAUAAlQIAIdABAQCSAgAh0QEBAJICACHSAQEAlAIAIdMBAQCSAgAh1AEBAJICACHVASAAoQIAIdYBQACVAgAhAwAAAAsAIAEAAPcBADAkAAD4AQAgAwAAAAsAIAEAAOYBADACAADjAQAgAQAAABwAIAEAAAAcACADAAAAGAAgAQAAGwAwAgAAHAAgAwAAABgAIAEAABsAMAIAABwAIAMAAAAYACABAAAbADACAAAcACAKCgAA7gIAIAwAAOwCACANAADtAgAgvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcIBAQAAAAHDAQEAAAABxAFAAAAAAQEYAACAAgAgB74BAQAAAAG_AQIAAAABwAEBAAAAAcEBAQAAAAHCAQEAAAABwwEBAAAAAcQBQAAAAAEBGAAAggIAMAEYAACCAgAwCgoAAOsCACAMAADpAgAgDQAA6gIAIL4BAQDlAgAhvwECAOYCACHAAQEA5wIAIcEBAQDlAgAhwgEBAOUCACHDAQEA5QIAIcQBQADoAgAhAgAAABwAIBgAAIUCACAHvgEBAOUCACG_AQIA5gIAIcABAQDnAgAhwQEBAOUCACHCAQEA5QIAIcMBAQDlAgAhxAFAAOgCACECAAAAGAAgGAAAhwIAIAIAAAAYACAYAACHAgAgAwAAABwAIB8AAIACACAgAACFAgAgAQAAABwAIAEAAAAYACAGCAAA4AIAICUAAOMCACAmAADiAgAgdwAA4QIAIHgAAOQCACDAAQAA3wIAIAq7AQAAkQIAMLwBAACOAgAQvQEAAJECADC-AQEAkgIAIb8BAgCTAgAhwAEBAJQCACHBAQEAkgIAIcIBAQCSAgAhwwEBAJICACHEAUAAlQIAIQMAAAAYACABAACNAgAwJAAAjgIAIAMAAAAYACABAAAbADACAAAcACAKuwEAAJECADC8AQAAjgIAEL0BAACRAgAwvgEBAJICACG_AQIAkwIAIcABAQCUAgAhwQEBAJICACHCAQEAkgIAIcMBAQCSAgAhxAFAAJUCACEOCAAAlwIAICUAAJ8CACAmAACfAgAgxQEBAAAAAcYBAQAAAATHAQEAAAAEyAEBAAAAAckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQCeAgAhzQEBAAAAAc4BAQAAAAHPAQEAAAABDQgAAJcCACAlAACXAgAgJgAAlwIAIHcAAJ0CACB4AACXAgAgxQECAAAAAcYBAgAAAATHAQIAAAAEyAECAAAAAckBAgAAAAHKAQIAAAABywECAAAAAcwBAgCcAgAhDggAAJoCACAlAACbAgAgJgAAmwIAIMUBAQAAAAHGAQEAAAAFxwEBAAAABcgBAQAAAAHJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAmQIAIc0BAQAAAAHOAQEAAAABzwEBAAAAAQsIAACXAgAgJQAAmAIAICYAAJgCACDFAUAAAAABxgFAAAAABMcBQAAAAATIAUAAAAAByQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAJYCACELCAAAlwIAICUAAJgCACAmAACYAgAgxQFAAAAAAcYBQAAAAATHAUAAAAAEyAFAAAAAAckBQAAAAAHKAUAAAAABywFAAAAAAcwBQACWAgAhCMUBAgAAAAHGAQIAAAAExwECAAAABMgBAgAAAAHJAQIAAAABygECAAAAAcsBAgAAAAHMAQIAlwIAIQjFAUAAAAABxgFAAAAABMcBQAAAAATIAUAAAAAByQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAJgCACEOCAAAmgIAICUAAJsCACAmAACbAgAgxQEBAAAAAcYBAQAAAAXHAQEAAAAFyAEBAAAAAckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQCZAgAhzQEBAAAAAc4BAQAAAAHPAQEAAAABCMUBAgAAAAHGAQIAAAAFxwECAAAABcgBAgAAAAHJAQIAAAABygECAAAAAcsBAgAAAAHMAQIAmgIAIQvFAQEAAAABxgEBAAAABccBAQAAAAXIAQEAAAAByQEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAJsCACHNAQEAAAABzgEBAAAAAc8BAQAAAAENCAAAlwIAICUAAJcCACAmAACXAgAgdwAAnQIAIHgAAJcCACDFAQIAAAABxgECAAAABMcBAgAAAATIAQIAAAAByQECAAAAAcoBAgAAAAHLAQIAAAABzAECAJwCACEIxQEIAAAAAcYBCAAAAATHAQgAAAAEyAEIAAAAAckBCAAAAAHKAQgAAAABywEIAAAAAcwBCACdAgAhDggAAJcCACAlAACfAgAgJgAAnwIAIMUBAQAAAAHGAQEAAAAExwEBAAAABMgBAQAAAAHJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAngIAIc0BAQAAAAHOAQEAAAABzwEBAAAAAQvFAQEAAAABxgEBAAAABMcBAQAAAATIAQEAAAAByQEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAJ8CACHNAQEAAAABzgEBAAAAAc8BAQAAAAEMuwEAAKACADC8AQAA-AEAEL0BAACgAgAwvgEBAJICACHEAUAAlQIAIdABAQCSAgAh0QEBAJICACHSAQEAlAIAIdMBAQCSAgAh1AEBAJICACHVASAAoQIAIdYBQACVAgAhBQgAAJcCACAlAACjAgAgJgAAowIAIMUBIAAAAAHMASAAogIAIQUIAACXAgAgJQAAowIAICYAAKMCACDFASAAAAABzAEgAKICACECxQEgAAAAAcwBIACjAgAhDwMAAKkCACAHAACqAgAgEQAAqwIAILsBAACkAgAwvAEAAAsAEL0BAACkAgAwvgEBAKUCACHEAUAAqAIAIdABAQClAgAh0QEBAKUCACHSAQEApgIAIdMBAQClAgAh1AEBAKUCACHVASAApwIAIdYBQACoAgAhC8UBAQAAAAHGAQEAAAAExwEBAAAABMgBAQAAAAHJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAnwIAIc0BAQAAAAHOAQEAAAABzwEBAAAAAQvFAQEAAAABxgEBAAAABccBAQAAAAXIAQEAAAAByQEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAJsCACHNAQEAAAABzgEBAAAAAc8BAQAAAAECxQEgAAAAAcwBIACjAgAhCMUBQAAAAAHGAUAAAAAExwFAAAAABMgBQAAAAAHJAUAAAAABygFAAAAAAcsBQAAAAAHMAUAAmAIAIRQEAADKAgAgBQAAywIAIBAAAM0CACARAACrAgAgEgAAzAIAILsBAADHAgAwvAEAAC0AEL0BAADHAgAwvgEBAKUCACHEAUAAqAIAIdQBAQCmAgAh1gFAAKgCACHbAQAAyQL-ASPiAQEApQIAIfgBAQClAgAh-QEgAKcCACH6AQEApgIAIfwBAADIAvwBI_4BAAAtACD_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-ASPiAQEAkgIAIfgBAQCSAgAh-QEgAKECACH6AQEAlAIAIfwBAADBAvwBIwcIAACaAgAgJQAAxgIAICYAAMYCACDFAQAAAPwBA8YBAAAA_AEJxwEAAAD8AQnMAQAAxQL8ASMHCAAAmgIAICUAAMQCACAmAADEAgAgxQEAAAD-AQPGAQAAAP4BCccBAAAA_gEJzAEAAMMC_gEjBwgAAJoCACAlAADEAgAgJgAAxAIAIMUBAAAA_gEDxgEAAAD-AQnHAQAAAP4BCcwBAADDAv4BIwTFAQAAAP4BA8YBAAAA_gEJxwEAAAD-AQnMAQAAxAL-ASMHCAAAmgIAICUAAMYCACAmAADGAgAgxQEAAAD8AQPGAQAAAPwBCccBAAAA_AEJzAEAAMUC_AEjBMUBAAAA_AEDxgEAAAD8AQnHAQAAAPwBCcwBAADGAvwBIxIEAADKAgAgBQAAywIAIBAAAM0CACARAACrAgAgEgAAzAIAILsBAADHAgAwvAEAAC0AEL0BAADHAgAwvgEBAKUCACHEAUAAqAIAIdQBAQCmAgAh1gFAAKgCACHbAQAAyQL-ASPiAQEApQIAIfgBAQClAgAh-QEgAKcCACH6AQEApgIAIfwBAADIAvwBIwTFAQAAAPwBA8YBAAAA_AEJxwEAAAD8AQnMAQAAxgL8ASMExQEAAAD-AQPGAQAAAP4BCccBAAAA_gEJzAEAAMQC_gEjA9cBAAADACDYAQAAAwAg2QEAAAMAIAPXAQAABwAg2AEAAAcAINkBAAAHACARAwAAqQIAIAcAAKoCACARAACrAgAguwEAAKQCADC8AQAACwAQvQEAAKQCADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHRAQEApQIAIdIBAQCmAgAh0wEBAKUCACHUAQEApQIAIdUBIACnAgAh1gFAAKgCACH-AQAACwAg_wEAAAsAIAPXAQAAGAAg2AEAABgAINkBAAAYACAPBgAA0QIAIAoAAKkCACALAADSAgAgDgAA0wIAILsBAADOAgAwvAEAACAAEL0BAADOAgAwvgEBAKUCACHDAQEApQIAIcQBQACoAgAh1gFAAKgCACHbAQAAzwLbASLcAQgA0AIAId0BAQClAgAh3gEBAKUCACEExQEAAADbAQLGAQAAANsBCMcBAAAA2wEIzAEAALEC2wEiCMUBCAAAAAHGAQgAAAAExwEIAAAABMgBCAAAAAHJAQgAAAABygEIAAAAAcsBCAAAAAHMAQgAnQIAIREDAACpAgAgBwAAqgIAIBEAAKsCACC7AQAApAIAMLwBAAALABC9AQAApAIAML4BAQClAgAhxAFAAKgCACHQAQEApQIAIdEBAQClAgAh0gEBAKYCACHTAQEApQIAIdQBAQClAgAh1QEgAKcCACHWAUAAqAIAIf4BAAALACD_AQAACwAgA9cBAAATACDYAQAAEwAg2QEAABMAIA8KAACpAgAgDAAA1gIAIA0AANcCACC7AQAA1AIAMLwBAAAYABC9AQAA1AIAML4BAQClAgAhvwECANUCACHAAQEApgIAIcEBAQClAgAhwgEBAKUCACHDAQEApQIAIcQBQACoAgAh_gEAABgAIP8BAAAYACANCgAAqQIAIAwAANYCACANAADXAgAguwEAANQCADC8AQAAGAAQvQEAANQCADC-AQEApQIAIb8BAgDVAgAhwAEBAKYCACHBAQEApQIAIcIBAQClAgAhwwEBAKUCACHEAUAAqAIAIQjFAQIAAAABxgECAAAABMcBAgAAAATIAQIAAAAByQECAAAAAcoBAgAAAAHLAQIAAAABzAECAJcCACERBgAA0QIAIAoAAKkCACALAADSAgAgDgAA0wIAILsBAADOAgAwvAEAACAAEL0BAADOAgAwvgEBAKUCACHDAQEApQIAIcQBQACoAgAh1gFAAKgCACHbAQAAzwLbASLcAQgA0AIAId0BAQClAgAh3gEBAKUCACH-AQAAIAAg_wEAACAAIBQGAADRAgAgCQAA2wIAIA8AANICACAQAADNAgAguwEAANkCADC8AQAADQAQvQEAANkCADC-AQEApQIAIcQBQACoAgAh0gEBAKYCACHWAUAAqAIAId4BAQClAgAh4gEBAKUCACHjAQgA0AIAIeQBAQCmAgAh5gEAANoC5gEi5wEgAKcCACHoAQEApQIAIf4BAAANACD_AQAADQAgCwwAANYCACANAADXAgAguwEAANgCADC8AQAAEwAQvQEAANgCADC-AQEApQIAIcEBAQClAgAhwgEBAKUCACHfAQIA1QIAIeABAQClAgAh4QEIANACACESBgAA0QIAIAkAANsCACAPAADSAgAgEAAAzQIAILsBAADZAgAwvAEAAA0AEL0BAADZAgAwvgEBAKUCACHEAUAAqAIAIdIBAQCmAgAh1gFAAKgCACHeAQEApQIAIeIBAQClAgAh4wEIANACACHkAQEApgIAIeYBAADaAuYBIucBIACnAgAh6AEBAKUCACEExQEAAADmAQLGAQAAAOYBCMcBAAAA5gEIzAEAALYC5gEiCwcAAKoCACC7AQAAuAIAMLwBAACLAQAQvQEAALgCADC-AQEApQIAIcQBQACoAgAh1gFAAKgCACHiAQEApQIAIekBAQClAgAh_gEAAIsBACD_AQAAiwEAIBEDAACpAgAguwEAANwCADC8AQAABwAQvQEAANwCADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHWAUAAqAIAId4BAQClAgAh7QEBAKUCACHuAQEApgIAIe8BAQCmAgAh8AEBAKYCACHxAUAA3QIAIfIBQADdAgAh8wEBAKYCACH0AQEApgIAIQjFAUAAAAABxgFAAAAABccBQAAAAAXIAUAAAAAByQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAL4CACEMAwAAqQIAILsBAADeAgAwvAEAAAMAEL0BAADeAgAwvgEBAKUCACHEAUAAqAIAIdABAQClAgAh1gFAAKgCACHsAUAAqAIAIfUBAQClAgAh9gEBAKYCACH3AQEApgIAIQAAAAAAAAGDAgEAAAABBYMCAgAAAAGJAgIAAAABigICAAAAAYsCAgAAAAGMAgIAAAABAYMCAQAAAAEBgwJAAAAAAQUfAAD-BAAgIAAAhwUAIIACAAD_BAAggQIAAIYFACCGAgAAIgAgBR8AAPwEACAgAACEBQAggAIAAP0EACCBAgAAgwUAIIYCAAAPACAFHwAA-gQAICAAAIEFACCAAgAA-wQAIIECAACABQAghgIAAAEAIAMfAAD-BAAggAIAAP8EACCGAgAAIgAgAx8AAPwEACCAAgAA_QQAIIYCAAAPACADHwAA-gQAIIACAAD7BAAghgIAAAEAIAAAAAGDAiAAAAABBR8AANwEACAgAAD4BAAggAIAAN0EACCBAgAA9wQAIIYCAAABACALHwAAnQMAMCAAAKIDADCAAgAAngMAMIECAACfAwAwggIAAKADACCDAgAAoQMAMIQCAAChAwAwhQIAAKEDADCGAgAAoQMAMIcCAACjAwAwiAIAAKQDADALHwAA9gIAMCAAAPsCADCAAgAA9wIAMIECAAD4AgAwggIAAPkCACCDAgAA-gIAMIQCAAD6AgAwhQIAAPoCADCGAgAA-gIAMIcCAAD8AgAwiAIAAP0CADAKCgAAmgMAIAsAAJsDACAOAACcAwAgvgEBAAAAAcMBAQAAAAHEAUAAAAAB1gFAAAAAAdsBAAAA2wEC3AEIAAAAAd0BAQAAAAECAAAAIgAgHwAAmQMAIAMAAAAiACAfAACZAwAgIAAAggMAIAEYAAD2BAAwDwYAANECACAKAACpAgAgCwAA0gIAIA4AANMCACC7AQAAzgIAMLwBAAAgABC9AQAAzgIAML4BAQAAAAHDAQEApQIAIcQBQACoAgAh1gFAAKgCACHbAQAAzwLbASLcAQgA0AIAId0BAQClAgAh3gEBAKUCACECAAAAIgAgGAAAggMAIAIAAAD-AgAgGAAA_wIAIAu7AQAA_QIAMLwBAAD-AgAQvQEAAP0CADC-AQEApQIAIcMBAQClAgAhxAFAAKgCACHWAUAAqAIAIdsBAADPAtsBItwBCADQAgAh3QEBAKUCACHeAQEApQIAIQu7AQAA_QIAMLwBAAD-AgAQvQEAAP0CADC-AQEApQIAIcMBAQClAgAhxAFAAKgCACHWAUAAqAIAIdsBAADPAtsBItwBCADQAgAh3QEBAKUCACHeAQEApQIAIQe-AQEA5QIAIcMBAQDlAgAhxAFAAOgCACHWAUAA6AIAIdsBAACAA9sBItwBCACBAwAh3QEBAOUCACEBgwIAAADbAQIFgwIIAAAAAYkCCAAAAAGKAggAAAABiwIIAAAAAYwCCAAAAAEKCgAAgwMAIAsAAIQDACAOAACFAwAgvgEBAOUCACHDAQEA5QIAIcQBQADoAgAh1gFAAOgCACHbAQAAgAPbASLcAQgAgQMAId0BAQDlAgAhBR8AAOsEACAgAAD0BAAggAIAAOwEACCBAgAA8wQAIIYCAAABACALHwAAiwMAMCAAAJADADCAAgAAjAMAMIECAACNAwAwggIAAI4DACCDAgAAjwMAMIQCAACPAwAwhQIAAI8DADCGAgAAjwMAMIcCAACRAwAwiAIAAJIDADAHHwAAhgMAICAAAIkDACCAAgAAhwMAIIECAACIAwAghAIAABgAIIUCAAAYACCGAgAAHAAgCAoAAO4CACANAADtAgAgvgEBAAAAAb8BAgAAAAHAAQEAAAABwgEBAAAAAcMBAQAAAAHEAUAAAAABAgAAABwAIB8AAIYDACADAAAAGAAgHwAAhgMAICAAAIoDACAKAAAAGAAgCgAA6wIAIA0AAOoCACAYAACKAwAgvgEBAOUCACG_AQIA5gIAIcABAQDnAgAhwgEBAOUCACHDAQEA5QIAIcQBQADoAgAhCAoAAOsCACANAADqAgAgvgEBAOUCACG_AQIA5gIAIcABAQDnAgAhwgEBAOUCACHDAQEA5QIAIcQBQADoAgAhBg0AAJgDACC-AQEAAAABwgEBAAAAAd8BAgAAAAHgAQEAAAAB4QEIAAAAAQIAAAAVACAfAACXAwAgAwAAABUAIB8AAJcDACAgAACVAwAgARgAAPIEADALDAAA1gIAIA0AANcCACC7AQAA2AIAMLwBAAATABC9AQAA2AIAML4BAQAAAAHBAQEApQIAIcIBAQClAgAh3wECANUCACHgAQEApQIAIeEBCADQAgAhAgAAABUAIBgAAJUDACACAAAAkwMAIBgAAJQDACAJuwEAAJIDADC8AQAAkwMAEL0BAACSAwAwvgEBAKUCACHBAQEApQIAIcIBAQClAgAh3wECANUCACHgAQEApQIAIeEBCADQAgAhCbsBAACSAwAwvAEAAJMDABC9AQAAkgMAML4BAQClAgAhwQEBAKUCACHCAQEApQIAId8BAgDVAgAh4AEBAKUCACHhAQgA0AIAIQW-AQEA5QIAIcIBAQDlAgAh3wECAOYCACHgAQEA5QIAIeEBCACBAwAhBg0AAJYDACC-AQEA5QIAIcIBAQDlAgAh3wECAOYCACHgAQEA5QIAIeEBCACBAwAhBR8AAO0EACAgAADwBAAggAIAAO4EACCBAgAA7wQAIIYCAAAPACAGDQAAmAMAIL4BAQAAAAHCAQEAAAAB3wECAAAAAeABAQAAAAHhAQgAAAABAx8AAO0EACCAAgAA7gQAIIYCAAAPACAKCgAAmgMAIAsAAJsDACAOAACcAwAgvgEBAAAAAcMBAQAAAAHEAUAAAAAB1gFAAAAAAdsBAAAA2wEC3AEIAAAAAd0BAQAAAAEDHwAA6wQAIIACAADsBAAghgIAAAEAIAQfAACLAwAwgAIAAIwDADCCAgAAjgMAIIYCAACPAwAwAx8AAIYDACCAAgAAhwMAIIYCAAAcACANCQAAxAMAIA8AAMUDACAQAADGAwAgvgEBAAAAAcQBQAAAAAHSAQEAAAAB1gFAAAAAAeIBAQAAAAHjAQgAAAAB5AEBAAAAAeYBAAAA5gEC5wEgAAAAAegBAQAAAAECAAAADwAgHwAAwwMAIAMAAAAPACAfAADDAwAgIAAAqAMAIAEYAADqBAAwEgYAANECACAJAADbAgAgDwAA0gIAIBAAAM0CACC7AQAA2QIAMLwBAAANABC9AQAA2QIAML4BAQAAAAHEAUAAqAIAIdIBAQCmAgAh1gFAAKgCACHeAQEApQIAIeIBAQClAgAh4wEIANACACHkAQEApgIAIeYBAADaAuYBIucBIACnAgAh6AEBAKUCACECAAAADwAgGAAAqAMAIAIAAAClAwAgGAAApgMAIA67AQAApAMAMLwBAAClAwAQvQEAAKQDADC-AQEApQIAIcQBQACoAgAh0gEBAKYCACHWAUAAqAIAId4BAQClAgAh4gEBAKUCACHjAQgA0AIAIeQBAQCmAgAh5gEAANoC5gEi5wEgAKcCACHoAQEApQIAIQ67AQAApAMAMLwBAAClAwAQvQEAAKQDADC-AQEApQIAIcQBQACoAgAh0gEBAKYCACHWAUAAqAIAId4BAQClAgAh4gEBAKUCACHjAQgA0AIAIeQBAQCmAgAh5gEAANoC5gEi5wEgAKcCACHoAQEApQIAIQq-AQEA5QIAIcQBQADoAgAh0gEBAOcCACHWAUAA6AIAIeIBAQDlAgAh4wEIAIEDACHkAQEA5wIAIeYBAACnA-YBIucBIADyAgAh6AEBAOUCACEBgwIAAADmAQINCQAAqQMAIA8AAKoDACAQAACrAwAgvgEBAOUCACHEAUAA6AIAIdIBAQDnAgAh1gFAAOgCACHiAQEA5QIAIeMBCACBAwAh5AEBAOcCACHmAQAApwPmASLnASAA8gIAIegBAQDlAgAhBR8AAN4EACAgAADoBAAggAIAAN8EACCBAgAA5wQAIIYCAACIAQAgCx8AALgDADAgAAC8AwAwgAIAALkDADCBAgAAugMAMIICAAC7AwAggwIAAI8DADCEAgAAjwMAMIUCAACPAwAwhgIAAI8DADCHAgAAvQMAMIgCAACSAwAwCx8AAKwDADAgAACxAwAwgAIAAK0DADCBAgAArgMAMIICAACvAwAggwIAALADADCEAgAAsAMAMIUCAACwAwAwhgIAALADADCHAgAAsgMAMIgCAACzAwAwCAoAAO4CACAMAADsAgAgvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcMBAQAAAAHEAUAAAAABAgAAABwAIB8AALcDACADAAAAHAAgHwAAtwMAICAAALYDACABGAAA5gQAMA0KAACpAgAgDAAA1gIAIA0AANcCACC7AQAA1AIAMLwBAAAYABC9AQAA1AIAML4BAQAAAAG_AQIA1QIAIcABAQCmAgAhwQEBAAAAAcIBAQClAgAhwwEBAKUCACHEAUAAqAIAIQIAAAAcACAYAAC2AwAgAgAAALQDACAYAAC1AwAgCrsBAACzAwAwvAEAALQDABC9AQAAswMAML4BAQClAgAhvwECANUCACHAAQEApgIAIcEBAQClAgAhwgEBAKUCACHDAQEApQIAIcQBQACoAgAhCrsBAACzAwAwvAEAALQDABC9AQAAswMAML4BAQClAgAhvwECANUCACHAAQEApgIAIcEBAQClAgAhwgEBAKUCACHDAQEApQIAIcQBQACoAgAhBr4BAQDlAgAhvwECAOYCACHAAQEA5wIAIcEBAQDlAgAhwwEBAOUCACHEAUAA6AIAIQgKAADrAgAgDAAA6QIAIL4BAQDlAgAhvwECAOYCACHAAQEA5wIAIcEBAQDlAgAhwwEBAOUCACHEAUAA6AIAIQgKAADuAgAgDAAA7AIAIL4BAQAAAAG_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_AQIAAAABwAEBAAAAAcEBAQAAAAHCAQEAAAABxAFAAAAAAQoGAADTAwAgCwAAmwMAIA4AAJwDACC-AQEAAAABxAFAAAAAAdYBQAAAAAHbAQAAANsBAtwBCAAAAAHdAQEAAAAB3gEBAAAAAQIAAAAiACAfAACXBAAgAwAAACIAIB8AAJcEACAgAACWBAAgARgAAMUEADACAAAAIgAgGAAAlgQAIAIAAAD-AgAgGAAAlQQAIAe-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_BAAgBgYAALwEACAJAADCBAAgDwAAvgQAIBAAAL0EACDSAQAA3wIAIOQBAADfAgAgAQcAAMsDACAHvgEBAAAAAcQBQAAAAAHWAUAAAAAB7AFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAQy-AQEAAAABxAFAAAAAAdYBQAAAAAHeAQEAAAAB7QEBAAAAAe4BAQAAAAHvAQEAAAAB8AEBAAAAAfEBQAAAAAHyAUAAAAAB8wEBAAAAAfQBAQAAAAEHvgEBAAAAAcQBQAAAAAHWAUAAAAAB2wEAAADbAQLcAQgAAAAB3QEBAAAAAd4BAQAAAAEGvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcIBAQAAAAHEAUAAAAABDgUAALYEACAQAAC5BAAgEQAAuAQAIBIAALcEACC-AQEAAAABxAFAAAAAAdQBAQAAAAHWAUAAAAAB2wEAAAD-AQPiAQEAAAAB-AEBAAAAAfkBIAAAAAH6AQEAAAAB_AEAAAD8AQMCAAAAAQAgHwAAxwQAIAMAAAAtACAfAADHBAAgIAAAywQAIBAAAAAtACAFAACCBAAgEAAAhQQAIBEAAIQEACASAACDBAAgGAAAywQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMOBQAAggQAIBAAAIUEACARAACEBAAgEgAAgwQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMOBAAAtQQAIBAAALkEACARAAC4BAAgEgAAtwQAIL4BAQAAAAHEAUAAAAAB1AEBAAAAAdYBQAAAAAHbAQAAAP4BA-IBAQAAAAH4AQEAAAAB-QEgAAAAAfoBAQAAAAH8AQAAAPwBAwIAAAABACAfAADMBAAgAwAAAC0AIB8AAMwEACAgAADQBAAgEAAAAC0AIAQAAIEEACAQAACFBAAgEQAAhAQAIBIAAIMEACAYAADQBAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIw4EAACBBAAgEAAAhQQAIBEAAIQEACASAACDBAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIwq-AQEAAAABxAFAAAAAAdIBAQAAAAHWAUAAAAAB3gEBAAAAAeIBAQAAAAHjAQgAAAAB5AEBAAAAAeYBAAAA5gEC5wEgAAAAAQsDAADHAwAgEQAAyQMAIL4BAQAAAAHEAUAAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVASAAAAAB1gFAAAAAAQIAAADjAQAgHwAA0gQAIAMAAAALACAfAADSBAAgIAAA1gQAIA0AAAALACADAADzAgAgEQAA9QIAIBgAANYEACC-AQEA5QIAIcQBQADoAgAh0AEBAOUCACHRAQEA5QIAIdIBAQDnAgAh0wEBAOUCACHUAQEA5QIAIdUBIADyAgAh1gFAAOgCACELAwAA8wIAIBEAAPUCACC-AQEA5QIAIcQBQADoAgAh0AEBAOUCACHRAQEA5QIAIdIBAQDnAgAh0wEBAOUCACHUAQEA5QIAIdUBIADyAgAh1gFAAOgCACELAwAAxwMAIAcAAMgDACC-AQEAAAABxAFAAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQAAAAHUAQEAAAAB1QEgAAAAAdYBQAAAAAECAAAA4wEAIB8AANcEACADAAAACwAgHwAA1wQAICAAANsEACANAAAACwAgAwAA8wIAIAcAAPQCACAYAADbBAAgvgEBAOUCACHEAUAA6AIAIdABAQDlAgAh0QEBAOUCACHSAQEA5wIAIdMBAQDlAgAh1AEBAOUCACHVASAA8gIAIdYBQADoAgAhCwMAAPMCACAHAAD0AgAgvgEBAOUCACHEAUAA6AIAIdABAQDlAgAh0QEBAOUCACHSAQEA5wIAIdMBAQDlAgAh1AEBAOUCACHVASAA8gIAIdYBQADoAgAhDgQAALUEACAFAAC2BAAgEAAAuQQAIBEAALgEACC-AQEAAAABxAFAAAAAAdQBAQAAAAHWAUAAAAAB2wEAAAD-AQPiAQEAAAAB-AEBAAAAAfkBIAAAAAH6AQEAAAAB_AEAAAD8AQMCAAAAAQAgHwAA3AQAIAW-AQEAAAABxAFAAAAAAdYBQAAAAAHiAQEAAAAB6QEBAAAAAQIAAACIAQAgHwAA3gQAIAsGAADTAwAgCgAAmgMAIA4AAJwDACC-AQEAAAABwwEBAAAAAcQBQAAAAAHWAUAAAAAB2wEAAADbAQLcAQgAAAAB3QEBAAAAAd4BAQAAAAECAAAAIgAgHwAA4AQAIAMAAAAgACAfAADgBAAgIAAA5AQAIA0AAAAgACAGAADSAwAgCgAAgwMAIA4AAIUDACAYAADkBAAgvgEBAOUCACHDAQEA5QIAIcQBQADoAgAh1gFAAOgCACHbAQAAgAPbASLcAQgAgQMAId0BAQDlAgAh3gEBAOUCACELBgAA0gMAIAoAAIMDACAOAACFAwAgvgEBAOUCACHDAQEA5QIAIcQBQADoAgAh1gFAAOgCACHbAQAAgAPbASLcAQgAgQMAId0BAQDlAgAh3gEBAOUCACEFvgEBAAAAAcEBAQAAAAHfAQIAAAAB4AEBAAAAAeEBCAAAAAEGvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcMBAQAAAAHEAUAAAAABAwAAAIsBACAfAADeBAAgIAAA6QQAIAcAAACLAQAgGAAA6QQAIL4BAQDlAgAhxAFAAOgCACHWAUAA6AIAIeIBAQDlAgAh6QEBAOUCACEFvgEBAOUCACHEAUAA6AIAIdYBQADoAgAh4gEBAOUCACHpAQEA5QIAIQq-AQEAAAABxAFAAAAAAdIBAQAAAAHWAUAAAAAB4gEBAAAAAeMBCAAAAAHkAQEAAAAB5gEAAADmAQLnASAAAAAB6AEBAAAAAQ4EAAC1BAAgBQAAtgQAIBAAALkEACASAAC3BAAgvgEBAAAAAcQBQAAAAAHUAQEAAAAB1gFAAAAAAdsBAAAA_gED4gEBAAAAAfgBAQAAAAH5ASAAAAAB-gEBAAAAAfwBAAAA_AEDAgAAAAEAIB8AAOsEACAOBgAA3wMAIAkAAMQDACAQAADGAwAgvgEBAAAAAcQBQAAAAAHSAQEAAAAB1gFAAAAAAd4BAQAAAAHiAQEAAAAB4wEIAAAAAeQBAQAAAAHmAQAAAOYBAucBIAAAAAHoAQEAAAABAgAAAA8AIB8AAO0EACADAAAADQAgHwAA7QQAICAAAPEEACAQAAAADQAgBgAA3gMAIAkAAKkDACAQAACrAwAgGAAA8QQAIL4BAQDlAgAhxAFAAOgCACHSAQEA5wIAIdYBQADoAgAh3gEBAOUCACHiAQEA5QIAIeMBCACBAwAh5AEBAOcCACHmAQAApwPmASLnASAA8gIAIegBAQDlAgAhDgYAAN4DACAJAACpAwAgEAAAqwMAIL4BAQDlAgAhxAFAAOgCACHSAQEA5wIAIdYBQADoAgAh3gEBAOUCACHiAQEA5QIAIeMBCACBAwAh5AEBAOcCACHmAQAApwPmASLnASAA8gIAIegBAQDlAgAhBb4BAQAAAAHCAQEAAAAB3wECAAAAAeABAQAAAAHhAQgAAAABAwAAAC0AIB8AAOsEACAgAAD1BAAgEAAAAC0AIAQAAIEEACAFAACCBAAgEAAAhQQAIBIAAIMEACAYAAD1BAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIw4EAACBBAAgBQAAggQAIBAAAIUEACASAACDBAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIwe-AQEAAAABwwEBAAAAAcQBQAAAAAHWAUAAAAAB2wEAAADbAQLcAQgAAAAB3QEBAAAAAQMAAAAtACAfAADcBAAgIAAA-QQAIBAAAAAtACAEAACBBAAgBQAAggQAIBAAAIUEACARAACEBAAgGAAA-QQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMOBAAAgQQAIAUAAIIEACAQAACFBAAgEQAAhAQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMOBAAAtQQAIAUAALYEACARAAC4BAAgEgAAtwQAIL4BAQAAAAHEAUAAAAAB1AEBAAAAAdYBQAAAAAHbAQAAAP4BA-IBAQAAAAH4AQEAAAAB-QEgAAAAAfoBAQAAAAH8AQAAAPwBAwIAAAABACAfAAD6BAAgDgYAAN8DACAJAADEAwAgDwAAxQMAIL4BAQAAAAHEAUAAAAAB0gEBAAAAAdYBQAAAAAHeAQEAAAAB4gEBAAAAAeMBCAAAAAHkAQEAAAAB5gEAAADmAQLnASAAAAAB6AEBAAAAAQIAAAAPACAfAAD8BAAgCwYAANMDACAKAACaAwAgCwAAmwMAIL4BAQAAAAHDAQEAAAABxAFAAAAAAdYBQAAAAAHbAQAAANsBAtwBCAAAAAHdAQEAAAAB3gEBAAAAAQIAAAAiACAfAAD-BAAgAwAAAC0AIB8AAPoEACAgAACCBQAgEAAAAC0AIAQAAIEEACAFAACCBAAgEQAAhAQAIBIAAIMEACAYAACCBQAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIw4EAACBBAAgBQAAggQAIBEAAIQEACASAACDBAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIwMAAAANACAfAAD8BAAgIAAAhQUAIBAAAAANACAGAADeAwAgCQAAqQMAIA8AAKoDACAYAACFBQAgvgEBAOUCACHEAUAA6AIAIdIBAQDnAgAh1gFAAOgCACHeAQEA5QIAIeIBAQDlAgAh4wEIAIEDACHkAQEA5wIAIeYBAACnA-YBIucBIADyAgAh6AEBAOUCACEOBgAA3gMAIAkAAKkDACAPAACqAwAgvgEBAOUCACHEAUAA6AIAIdIBAQDnAgAh1gFAAOgCACHeAQEA5QIAIeIBAQDlAgAh4wEIAIEDACHkAQEA5wIAIeYBAACnA-YBIucBIADyAgAh6AEBAOUCACEDAAAAIAAgHwAA_gQAICAAAIgFACANAAAAIAAgBgAA0gMAIAoAAIMDACALAACEAwAgGAAAiAUAIL4BAQDlAgAhwwEBAOUCACHEAUAA6AIAIdYBQADoAgAh2wEAAIAD2wEi3AEIAIEDACHdAQEA5QIAId4BAQDlAgAhCwYAANIDACAKAACDAwAgCwAAhAMAIL4BAQDlAgAhwwEBAOUCACHEAUAA6AIAIdYBQADoAgAh2wEAAIAD2wEi3AEIAIEDACHdAQEA5QIAId4BAQDlAgAhBgQGAgUKAwgADhAnChEmCRIMBAEDAAEBAwABBAMAAQcQBQgADREjCQUGAAQIAAwJAAYPFggQHQoCBxEFCAAHAQcSAAIMAAkNAAUFBgAECAALCgABCxcIDhkKAwoAAQwACQ0ABQELGgACDx4AEB8AAgckABElAAQEKAAFKQAQKwARKgAAAAADCAATJQAUJgAVAAAAAwgAEyUAFCYAFQEDAAEBAwABAwgAGiUAGyYAHAAAAAMIABolABsmABwBAwABAQMAAQMIACElACImACMAAAADCAAhJQAiJgAjAAAAAwgAKSUAKiYAKwAAAAMIACklAComACsAAAMIADAlADEmADIAAAADCAAwJQAxJgAyAgYABAkABgIGAAQJAAYFCAA3JQA6JgA7dwA4eAA5AAAAAAAFCAA3JQA6JgA7dwA4eAA5AgwACQ0ABQIMAAkNAAUFCABAJQBDJgBEdwBBeABCAAAAAAAFCABAJQBDJgBEdwBBeABCAgYABAoAAQIGAAQKAAEFCABJJQBMJgBNdwBKeABLAAAAAAAFCABJJQBMJgBNdwBKeABLAQMAAQEDAAEDCABSJQBTJgBUAAAAAwgAUiUAUyYAVAMKAAEMAAkNAAUDCgABDAAJDQAFBQgAWSUAXCYAXXcAWngAWwAAAAAABQgAWSUAXCYAXXcAWngAWxMCARQsARUvARYwARcxARkzARo1Dxs2EBw4AR06Dx47ESE8ASI9ASM-DydBEihCFilDAipEAitFAixGAi1HAi5JAi9LDzBMFzFOAjJQDzNRGDRSAjVTAjZUDzdXGThYHTlZAzpaAztbAzxcAz1dAz5fAz9hD0BiHkFkA0JmD0NnH0RoA0VpA0ZqD0dtIEhuJElwJUpxJUt0JUx1JU12JU54JU96D1B7JlF9JVJ_D1OAASdUgQElVYIBJVaDAQ9XhgEoWIcBLFmJAQZaigEGW40BBlyOAQZdjwEGXpEBBl-TAQ9glAEtYZYBBmKYAQ9jmQEuZJoBBmWbAQZmnAEPZ58BL2igATNpoQEFaqIBBWujAQVspAEFbaUBBW6nAQVvqQEPcKoBNHGsAQVyrgEPc68BNXSwAQV1sQEFdrIBD3m1ATZ6tgE8e7cBCHy4AQh9uQEIfroBCH-7AQiAAb0BCIEBvwEPggHAAT2DAcIBCIQBxAEPhQHFAT6GAcYBCIcBxwEIiAHIAQ-JAcsBP4oBzAFFiwHNAQmMAc4BCY0BzwEJjgHQAQmPAdEBCZAB0wEJkQHVAQ-SAdYBRpMB2AEJlAHaAQ-VAdsBR5YB3AEJlwHdAQmYAd4BD5kB4QFImgHiAU6bAeQBBJwB5QEEnQHnAQSeAegBBJ8B6QEEoAHrAQShAe0BD6IB7gFPowHwAQSkAfIBD6UB8wFQpgH0AQSnAfUBBKgB9gEPqQH5AVGqAfoBVasB-wEKrAH8AQqtAf0BCq4B_gEKrwH_AQqwAYECCrEBgwIPsgGEAlazAYYCCrQBiAIPtQGJAle2AYoCCrcBiwIKuAGMAg-5AY8CWLoBkAJe"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/enums.ts
var UserRole = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN"
};
var DietaryType = {
  VEGAN: "VEGAN",
  VEGETARIAN: "VEGETARIAN",
  GLUTEN_FREE: "GLUTEN_FREE",
  HALAL: "HALAL",
  NONE: "NONE"
};
var OrderStatus = {
  PLACED: "PLACED",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.FROTEND_URL],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.FROTEND_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Food Hub" <foodhubcontact@gmail.com>',
          to: user.email,
          subject: "Verify your email from \u2013 FoodHub",
          text: `
Hi ${user.name || "there"},

Welcome to FoodHub \u{1F371}

Thanks for creating your FoodHub account. Please verify your email address by clicking the link below:

${verificationUrl}

This helps us keep your account secure and ensures you don\u2019t miss important updates.

If you didn\u2019t create this account, you can safely ignore this email.

\u2014 FoodHub Team
`,
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;max-width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:#16a34a;padding:24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:0.5px;">
               FoodHub
              </h1>
              <p style="margin:6px 0 0;color:#dcfce7;font-size:14px;">
                Discover & Order Delicious Meals
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#111827;">
              <h2 style="margin-top:0;font-size:22px;">
                Verify your email address
              </h2>

              <p style="font-size:15px;line-height:1.6;">
                Hi <strong>${user.name || "there"}</strong>,
              </p>

              <p style="font-size:15px;line-height:1.6;">
                Thanks for joining <strong>FoodHub</strong>!  
                To complete your registration and start ordering delicious meals,
                please verify your email address.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${verificationUrl}"
                  style="
                    background:#16a34a;
                    color:#ffffff;
                    padding:14px 32px;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:600;
                    font-size:15px;
                    display:inline-block;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px;color:#374151;line-height:1.6;">
                If the button doesn\u2019t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:13px;color:#16a34a;word-break:break-all;">
                ${verificationUrl}
              </p>

              <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-top:24px;">
                If you didn\u2019t create a FoodHub account, you can safely ignore this email.
              </p>

              <p style="margin-top:32px;font-size:14px;color:#111827;">
                \u2014 FoodHub Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#6b7280;">
              \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} FoodHub. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
        });
      } catch (error) {
        throw error;
      }
    }
  }
});

// src/modules/category/category.routes.ts
import { Router } from "express";

// src/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/helpers/slug.ts
var slug = (text) => {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
};
var slug_default = slug;

// src/modules/category/category.service.ts
var createCategory = async (data) => {
  if (!data.name) {
    throw new AppError(400, "Category name is required");
  }
  const slugValue = slug_default(data.name);
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { name: data.name },
        { slug: slugValue }
      ]
    }
  });
  if (existingCategory) {
    throw new AppError(409, "Category already exists");
  }
  const result = await prisma.category.create({
    data: {
      ...data,
      slug: slugValue
    }
  });
  return result;
};
var getAllCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var updateCategories = async (categoryId, data) => {
  if (!categoryId) {
    throw new AppError(400, "Category id is required");
  }
  const updateData = {
    ...data
  };
  if (data.name) {
    updateData.slug = slug_default(data.name);
  }
  return await prisma.category.update({
    where: {
      id: categoryId
    },
    data: updateData
  });
};
var deleteCategories = async (categoryId) => {
  return await prisma.category.delete({
    where: {
      id: categoryId
    }
  });
};
var categoryService = {
  createCategory,
  getAllCategories,
  updateCategories,
  deleteCategories
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    if (req.user.role !== UserRole.ADMIN) {
      throw new AppError(403, "Only admin can create category");
    }
    const result = await categoryService.createCategory(req.body);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategories();
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateCategories2 = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.updateCategories(categoryId, req.body);
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategories2 = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.deleteCategories(categoryId);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategories: updateCategories2,
  deleteCategories: deleteCategories2
};

// src/middleware/auth.middleware.ts
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }
      if (!session?.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email not verified.Please verify your email!"
        });
      }
      const UserRole4 = session.user.role;
      req.user = {
        id: session?.user.id,
        name: session?.user.name,
        email: session?.user.email,
        emailVerified: session?.user.emailVerified,
        role: UserRole4
      };
      if (roles.length && !roles.includes(UserRole4)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden ! You are not authorized to access this resource"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/category/category.routes.ts
var router = Router();
router.post(
  "/categories",
  authMiddleware("ADMIN" /* admin */),
  categoryController.createCategory
);
router.get("/categories", categoryController.getAllCategories);
router.patch(
  "/categories/:categoryId",
  authMiddleware("ADMIN" /* admin */),
  categoryController.updateCategories
);
router.delete(
  "/categories/:categoryId",
  authMiddleware("ADMIN" /* admin */),
  categoryController.deleteCategories
);
var categoryRoutes = router;

// src/middleware/notFound.ts
import status from "http-status";
var notFound = (req, res) => {
  return res.status(status.NOT_FOUND).json({
    message: "Route not found",
    path: req.originalUrl
  });
};

// src/middleware/globalErrorHandle.ts
import { ZodError } from "zod";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// generated/prisma/internal/class.ts
import * as runtime3 from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.4.0",
  "engineVersion": "ab56fe763f921d033a6c195e7ddeb3e255bdbb57",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum UserRole {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nmodel User {\n  id            String  @id @default(cuid())\n  name          String\n  email         String  @unique\n  emailVerified Boolean @default(false)\n  image         String?\n  phone         String?\n\n  role   UserRole?   @default(CUSTOMER)\n  status UserStatus? @default(ACTIVE)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  sessions        Session[]\n  accounts        Account[]\n  providerProfile ProviderProfile?\n  orders          Order[]          @relation("CustomerOrders")\n  reviews         Review[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id   String @id @default(uuid())\n  name String @unique\n  slug String @unique\n\n  meals Meal[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("category")\n}\n\nenum DietaryType {\n  VEGAN\n  VEGETARIAN\n  GLUTEN_FREE\n  HALAL\n  NONE\n}\n\nmodel Meal {\n  id          String      @id @default(uuid())\n  name        String\n  description String?\n  price       Float\n  imageUrl    String?\n  dietaryType DietaryType @default(NONE)\n  isAvailable Boolean     @default(true)\n\n  providerId String\n  categoryId String\n\n  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  category   Category        @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("meal")\n}\n\nmodel OrderItem {\n  id        String @id @default(uuid())\n  quantity  Int\n  mealName  String\n  mealPrice Float\n\n  orderId String\n  mealId  String\n\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal  Meal  @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([id])\n  @@map("order-item")\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  status          OrderStatus @default(PLACED)\n  totalPrice      Float\n  deliveryAddress String\n\n  customerId String\n  providerId String\n\n  customer User            @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Cascade)\n  provider ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n\n  items  OrderItem[]\n  review Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("order")\n}\n\nmodel ProviderProfile {\n  id             String  @id @default(uuid())\n  userId         String  @unique\n  restaurantName String\n  description    String?\n  address        String\n  phone          String\n  isOpen         Boolean @default(true)\n\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  meals  Meal[]\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("provider-profile")\n}\n\nmodel Review {\n  id      String  @id @default(uuid())\n  rating  Int\n  comment String?\n\n  orderId    String @unique\n  mealId     String\n  customerId String\n\n  order    Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal     Meal  @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  customer User  @relation(fields: [customerId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n\n  @@index([id])\n  @@map("review")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  // output   = "../src/generated/prisma"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"category"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"dietaryType","kind":"enum","type":"DietaryType"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"meal"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"mealName","kind":"scalar","type":"String"},{"name":"mealPrice","kind":"scalar","type":"Float"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":"order-item"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"review","kind":"object","type":"Review","relationName":"OrderToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"order"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isOpen","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"provider-profile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"review"}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","provider","meals","_count","category","customer","items","order","meal","review","orderItems","reviews","orders","providerProfile","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","_avg","_sum","Meal.groupBy","Meal.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","ProviderProfile.findUnique","ProviderProfile.findUniqueOrThrow","ProviderProfile.findFirst","ProviderProfile.findFirstOrThrow","ProviderProfile.findMany","ProviderProfile.createOne","ProviderProfile.createMany","ProviderProfile.createManyAndReturn","ProviderProfile.updateOne","ProviderProfile.updateMany","ProviderProfile.updateManyAndReturn","ProviderProfile.upsertOne","ProviderProfile.deleteOne","ProviderProfile.deleteMany","ProviderProfile.groupBy","ProviderProfile.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","comment","orderId","mealId","customerId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","userId","restaurantName","description","address","phone","isOpen","updatedAt","every","some","none","OrderStatus","status","totalPrice","deliveryAddress","providerId","quantity","mealName","mealPrice","name","price","imageUrl","DietaryType","dietaryType","isAvailable","categoryId","slug","identifier","value","expiresAt","accountId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","UserRole","role","UserStatus","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "iAVeoAESBAAAygIAIAUAAMsCACAQAADNAgAgEQAAqwIAIBIAAMwCACC7AQAAxwIAMLwBAAAtABC9AQAAxwIAML4BAQAAAAHEAUAAqAIAIdQBAQCmAgAh1gFAAKgCACHbAQAAyQL-ASPiAQEApQIAIfgBAQAAAAH5ASAApwIAIfoBAQCmAgAh_AEAAMgC_AEjAQAAAAEAIAwDAACpAgAguwEAAN4CADC8AQAAAwAQvQEAAN4CADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHWAUAAqAIAIewBQACoAgAh9QEBAKUCACH2AQEApgIAIfcBAQCmAgAhAwMAAMoDACD2AQAA3wIAIPcBAADfAgAgDAMAAKkCACC7AQAA3gIAMLwBAAADABC9AQAA3gIAML4BAQAAAAHEAUAAqAIAIdABAQClAgAh1gFAAKgCACHsAUAAqAIAIfUBAQAAAAH2AQEApgIAIfcBAQCmAgAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACpAgAguwEAANwCADC8AQAABwAQvQEAANwCADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHWAUAAqAIAId4BAQClAgAh7QEBAKUCACHuAQEApgIAIe8BAQCmAgAh8AEBAKYCACHxAUAA3QIAIfIBQADdAgAh8wEBAKYCACH0AQEApgIAIQgDAADKAwAg7gEAAN8CACDvAQAA3wIAIPABAADfAgAg8QEAAN8CACDyAQAA3wIAIPMBAADfAgAg9AEAAN8CACARAwAAqQIAILsBAADcAgAwvAEAAAcAEL0BAADcAgAwvgEBAAAAAcQBQACoAgAh0AEBAKUCACHWAUAAqAIAId4BAQClAgAh7QEBAKUCACHuAQEApgIAIe8BAQCmAgAh8AEBAKYCACHxAUAA3QIAIfIBQADdAgAh8wEBAKYCACH0AQEApgIAIQMAAAAHACABAAAIADACAAAJACAPAwAAqQIAIAcAAKoCACARAACrAgAguwEAAKQCADC8AQAACwAQvQEAAKQCADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHRAQEApQIAIdIBAQCmAgAh0wEBAKUCACHUAQEApQIAIdUBIACnAgAh1gFAAKgCACEBAAAACwAgEgYAANECACAJAADbAgAgDwAA0gIAIBAAAM0CACC7AQAA2QIAMLwBAAANABC9AQAA2QIAML4BAQClAgAhxAFAAKgCACHSAQEApgIAIdYBQACoAgAh3gEBAKUCACHiAQEApQIAIeMBCADQAgAh5AEBAKYCACHmAQAA2gLmASLnASAApwIAIegBAQClAgAhBgYAALwEACAJAADCBAAgDwAAvgQAIBAAAL0EACDSAQAA3wIAIOQBAADfAgAgEgYAANECACAJAADbAgAgDwAA0gIAIBAAAM0CACC7AQAA2QIAMLwBAAANABC9AQAA2QIAML4BAQAAAAHEAUAAqAIAIdIBAQCmAgAh1gFAAKgCACHeAQEApQIAIeIBAQClAgAh4wEIANACACHkAQEApgIAIeYBAADaAuYBIucBIACnAgAh6AEBAKUCACEDAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAANACALDAAA1gIAIA0AANcCACC7AQAA2AIAMLwBAAATABC9AQAA2AIAML4BAQClAgAhwQEBAKUCACHCAQEApQIAId8BAgDVAgAh4AEBAKUCACHhAQgA0AIAIQIMAADABAAgDQAAwQQAIAsMAADWAgAgDQAA1wIAILsBAADYAgAwvAEAABMAEL0BAADYAgAwvgEBAAAAAcEBAQClAgAhwgEBAKUCACHfAQIA1QIAIeABAQClAgAh4QEIANACACEDAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIA0KAACpAgAgDAAA1gIAIA0AANcCACC7AQAA1AIAMLwBAAAYABC9AQAA1AIAML4BAQClAgAhvwECANUCACHAAQEApgIAIcEBAQClAgAhwgEBAKUCACHDAQEApQIAIcQBQACoAgAhAQAAABgAIAEAAAATACAECgAAygMAIAwAAMAEACANAADBBAAgwAEAAN8CACANCgAAqQIAIAwAANYCACANAADXAgAguwEAANQCADC8AQAAGAAQvQEAANQCADC-AQEAAAABvwECANUCACHAAQEApgIAIcEBAQAAAAHCAQEApQIAIcMBAQClAgAhxAFAAKgCACEDAAAAGAAgAQAAGwAwAgAAHAAgAQAAABMAIAEAAAAYACAPBgAA0QIAIAoAAKkCACALAADSAgAgDgAA0wIAILsBAADOAgAwvAEAACAAEL0BAADOAgAwvgEBAKUCACHDAQEApQIAIcQBQACoAgAh1gFAAKgCACHbAQAAzwLbASLcAQgA0AIAId0BAQClAgAh3gEBAKUCACEEBgAAvAQAIAoAAMoDACALAAC-BAAgDgAAvwQAIA8GAADRAgAgCgAAqQIAIAsAANICACAOAADTAgAguwEAAM4CADC8AQAAIAAQvQEAAM4CADC-AQEAAAABwwEBAKUCACHEAUAAqAIAIdYBQACoAgAh2wEAAM8C2wEi3AEIANACACHdAQEApQIAId4BAQClAgAhAwAAACAAIAEAACEAMAIAACIAIAEAAAANACABAAAAIAAgAwAAACAAIAEAACEAMAIAACIAIAMAAAAYACABAAAbADACAAAcACABAAAAAwAgAQAAAAcAIAEAAAAgACABAAAAGAAgAQAAAAEAIBIEAADKAgAgBQAAywIAIBAAAM0CACARAACrAgAgEgAAzAIAILsBAADHAgAwvAEAAC0AEL0BAADHAgAwvgEBAKUCACHEAUAAqAIAIdQBAQCmAgAh1gFAAKgCACHbAQAAyQL-ASPiAQEApQIAIfgBAQClAgAh-QEgAKcCACH6AQEApgIAIfwBAADIAvwBIwkEAAC6BAAgBQAAuwQAIBAAAL0EACARAADMAwAgEgAAvAQAINQBAADfAgAg2wEAAN8CACD6AQAA3wIAIPwBAADfAgAgAwAAAC0AIAEAAC4AMAIAAAEAIAMAAAAtACABAAAuADACAAABACADAAAALQAgAQAALgAwAgAAAQAgDwQAALUEACAFAAC2BAAgEAAAuQQAIBEAALgEACASAAC3BAAgvgEBAAAAAcQBQAAAAAHUAQEAAAAB1gFAAAAAAdsBAAAA_gED4gEBAAAAAfgBAQAAAAH5ASAAAAAB-gEBAAAAAfwBAAAA_AEDARgAADIAIAq-AQEAAAABxAFAAAAAAdQBAQAAAAHWAUAAAAAB2wEAAAD-AQPiAQEAAAAB-AEBAAAAAfkBIAAAAAH6AQEAAAAB_AEAAAD8AQMBGAAANAAwARgAADQAMA8EAACBBAAgBQAAggQAIBAAAIUEACARAACEBAAgEgAAgwQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMCAAAAAQAgGAAANwAgCr4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMCAAAALQAgGAAAOQAgAgAAAC0AIBgAADkAIAMAAAABACAfAAAyACAgAAA3ACABAAAAAQAgAQAAAC0AIAcIAAD8AwAgJQAA_gMAICYAAP0DACDUAQAA3wIAINsBAADfAgAg-gEAAN8CACD8AQAA3wIAIA27AQAAwAIAMLwBAABAABC9AQAAwAIAML4BAQCSAgAhxAFAAJUCACHUAQEAlAIAIdYBQACVAgAh2wEAAMIC_gEj4gEBAJICACH4AQEAkgIAIfkBIAChAgAh-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_AQIAAAABwAEBAAAAAcEBAQAAAAHCAQEAAAABwwEBAAAAAcQBQAAAAAEBGAAAggIAMAEYAACCAgAwCgoAAOsCACAMAADpAgAgDQAA6gIAIL4BAQDlAgAhvwECAOYCACHAAQEA5wIAIcEBAQDlAgAhwgEBAOUCACHDAQEA5QIAIcQBQADoAgAhAgAAABwAIBgAAIUCACAHvgEBAOUCACG_AQIA5gIAIcABAQDnAgAhwQEBAOUCACHCAQEA5QIAIcMBAQDlAgAhxAFAAOgCACECAAAAGAAgGAAAhwIAIAIAAAAYACAYAACHAgAgAwAAABwAIB8AAIACACAgAACFAgAgAQAAABwAIAEAAAAYACAGCAAA4AIAICUAAOMCACAmAADiAgAgdwAA4QIAIHgAAOQCACDAAQAA3wIAIAq7AQAAkQIAMLwBAACOAgAQvQEAAJECADC-AQEAkgIAIb8BAgCTAgAhwAEBAJQCACHBAQEAkgIAIcIBAQCSAgAhwwEBAJICACHEAUAAlQIAIQMAAAAYACABAACNAgAwJAAAjgIAIAMAAAAYACABAAAbADACAAAcACAKuwEAAJECADC8AQAAjgIAEL0BAACRAgAwvgEBAJICACG_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-ASPiAQEApQIAIfgBAQClAgAh-QEgAKcCACH6AQEApgIAIfwBAADIAvwBI_4BAAAtACD_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-ASPiAQEAkgIAIfgBAQCSAgAh-QEgAKECACH6AQEAlAIAIfwBAADBAvwBIwcIAACaAgAgJQAAxgIAICYAAMYCACDFAQAAAPwBA8YBAAAA_AEJxwEAAAD8AQnMAQAAxQL8ASMHCAAAmgIAICUAAMQCACAmAADEAgAgxQEAAAD-AQPGAQAAAP4BCccBAAAA_gEJzAEAAMMC_gEjBwgAAJoCACAlAADEAgAgJgAAxAIAIMUBAAAA_gEDxgEAAAD-AQnHAQAAAP4BCcwBAADDAv4BIwTFAQAAAP4BA8YBAAAA_gEJxwEAAAD-AQnMAQAAxAL-ASMHCAAAmgIAICUAAMYCACAmAADGAgAgxQEAAAD8AQPGAQAAAPwBCccBAAAA_AEJzAEAAMUC_AEjBMUBAAAA_AEDxgEAAAD8AQnHAQAAAPwBCcwBAADGAvwBIxIEAADKAgAgBQAAywIAIBAAAM0CACARAACrAgAgEgAAzAIAILsBAADHAgAwvAEAAC0AEL0BAADHAgAwvgEBAKUCACHEAUAAqAIAIdQBAQCmAgAh1gFAAKgCACHbAQAAyQL-ASPiAQEApQIAIfgBAQClAgAh-QEgAKcCACH6AQEApgIAIfwBAADIAvwBIwTFAQAAAPwBA8YBAAAA_AEJxwEAAAD8AQnMAQAAxgL8ASMExQEAAAD-AQPGAQAAAP4BCccBAAAA_gEJzAEAAMQC_gEjA9cBAAADACDYAQAAAwAg2QEAAAMAIAPXAQAABwAg2AEAAAcAINkBAAAHACARAwAAqQIAIAcAAKoCACARAACrAgAguwEAAKQCADC8AQAACwAQvQEAAKQCADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHRAQEApQIAIdIBAQCmAgAh0wEBAKUCACHUAQEApQIAIdUBIACnAgAh1gFAAKgCACH-AQAACwAg_wEAAAsAIAPXAQAAGAAg2AEAABgAINkBAAAYACAPBgAA0QIAIAoAAKkCACALAADSAgAgDgAA0wIAILsBAADOAgAwvAEAACAAEL0BAADOAgAwvgEBAKUCACHDAQEApQIAIcQBQACoAgAh1gFAAKgCACHbAQAAzwLbASLcAQgA0AIAId0BAQClAgAh3gEBAKUCACEExQEAAADbAQLGAQAAANsBCMcBAAAA2wEIzAEAALEC2wEiCMUBCAAAAAHGAQgAAAAExwEIAAAABMgBCAAAAAHJAQgAAAABygEIAAAAAcsBCAAAAAHMAQgAnQIAIREDAACpAgAgBwAAqgIAIBEAAKsCACC7AQAApAIAMLwBAAALABC9AQAApAIAML4BAQClAgAhxAFAAKgCACHQAQEApQIAIdEBAQClAgAh0gEBAKYCACHTAQEApQIAIdQBAQClAgAh1QEgAKcCACHWAUAAqAIAIf4BAAALACD_AQAACwAgA9cBAAATACDYAQAAEwAg2QEAABMAIA8KAACpAgAgDAAA1gIAIA0AANcCACC7AQAA1AIAMLwBAAAYABC9AQAA1AIAML4BAQClAgAhvwECANUCACHAAQEApgIAIcEBAQClAgAhwgEBAKUCACHDAQEApQIAIcQBQACoAgAh_gEAABgAIP8BAAAYACANCgAAqQIAIAwAANYCACANAADXAgAguwEAANQCADC8AQAAGAAQvQEAANQCADC-AQEApQIAIb8BAgDVAgAhwAEBAKYCACHBAQEApQIAIcIBAQClAgAhwwEBAKUCACHEAUAAqAIAIQjFAQIAAAABxgECAAAABMcBAgAAAATIAQIAAAAByQECAAAAAcoBAgAAAAHLAQIAAAABzAECAJcCACERBgAA0QIAIAoAAKkCACALAADSAgAgDgAA0wIAILsBAADOAgAwvAEAACAAEL0BAADOAgAwvgEBAKUCACHDAQEApQIAIcQBQACoAgAh1gFAAKgCACHbAQAAzwLbASLcAQgA0AIAId0BAQClAgAh3gEBAKUCACH-AQAAIAAg_wEAACAAIBQGAADRAgAgCQAA2wIAIA8AANICACAQAADNAgAguwEAANkCADC8AQAADQAQvQEAANkCADC-AQEApQIAIcQBQACoAgAh0gEBAKYCACHWAUAAqAIAId4BAQClAgAh4gEBAKUCACHjAQgA0AIAIeQBAQCmAgAh5gEAANoC5gEi5wEgAKcCACHoAQEApQIAIf4BAAANACD_AQAADQAgCwwAANYCACANAADXAgAguwEAANgCADC8AQAAEwAQvQEAANgCADC-AQEApQIAIcEBAQClAgAhwgEBAKUCACHfAQIA1QIAIeABAQClAgAh4QEIANACACESBgAA0QIAIAkAANsCACAPAADSAgAgEAAAzQIAILsBAADZAgAwvAEAAA0AEL0BAADZAgAwvgEBAKUCACHEAUAAqAIAIdIBAQCmAgAh1gFAAKgCACHeAQEApQIAIeIBAQClAgAh4wEIANACACHkAQEApgIAIeYBAADaAuYBIucBIACnAgAh6AEBAKUCACEExQEAAADmAQLGAQAAAOYBCMcBAAAA5gEIzAEAALYC5gEiCwcAAKoCACC7AQAAuAIAMLwBAACLAQAQvQEAALgCADC-AQEApQIAIcQBQACoAgAh1gFAAKgCACHiAQEApQIAIekBAQClAgAh_gEAAIsBACD_AQAAiwEAIBEDAACpAgAguwEAANwCADC8AQAABwAQvQEAANwCADC-AQEApQIAIcQBQACoAgAh0AEBAKUCACHWAUAAqAIAId4BAQClAgAh7QEBAKUCACHuAQEApgIAIe8BAQCmAgAh8AEBAKYCACHxAUAA3QIAIfIBQADdAgAh8wEBAKYCACH0AQEApgIAIQjFAUAAAAABxgFAAAAABccBQAAAAAXIAUAAAAAByQFAAAAAAcoBQAAAAAHLAUAAAAABzAFAAL4CACEMAwAAqQIAILsBAADeAgAwvAEAAAMAEL0BAADeAgAwvgEBAKUCACHEAUAAqAIAIdABAQClAgAh1gFAAKgCACHsAUAAqAIAIfUBAQClAgAh9gEBAKYCACH3AQEApgIAIQAAAAAAAAGDAgEAAAABBYMCAgAAAAGJAgIAAAABigICAAAAAYsCAgAAAAGMAgIAAAABAYMCAQAAAAEBgwJAAAAAAQUfAAD-BAAgIAAAhwUAIIACAAD_BAAggQIAAIYFACCGAgAAIgAgBR8AAPwEACAgAACEBQAggAIAAP0EACCBAgAAgwUAIIYCAAAPACAFHwAA-gQAICAAAIEFACCAAgAA-wQAIIECAACABQAghgIAAAEAIAMfAAD-BAAggAIAAP8EACCGAgAAIgAgAx8AAPwEACCAAgAA_QQAIIYCAAAPACADHwAA-gQAIIACAAD7BAAghgIAAAEAIAAAAAGDAiAAAAABBR8AANwEACAgAAD4BAAggAIAAN0EACCBAgAA9wQAIIYCAAABACALHwAAnQMAMCAAAKIDADCAAgAAngMAMIECAACfAwAwggIAAKADACCDAgAAoQMAMIQCAAChAwAwhQIAAKEDADCGAgAAoQMAMIcCAACjAwAwiAIAAKQDADALHwAA9gIAMCAAAPsCADCAAgAA9wIAMIECAAD4AgAwggIAAPkCACCDAgAA-gIAMIQCAAD6AgAwhQIAAPoCADCGAgAA-gIAMIcCAAD8AgAwiAIAAP0CADAKCgAAmgMAIAsAAJsDACAOAACcAwAgvgEBAAAAAcMBAQAAAAHEAUAAAAAB1gFAAAAAAdsBAAAA2wEC3AEIAAAAAd0BAQAAAAECAAAAIgAgHwAAmQMAIAMAAAAiACAfAACZAwAgIAAAggMAIAEYAAD2BAAwDwYAANECACAKAACpAgAgCwAA0gIAIA4AANMCACC7AQAAzgIAMLwBAAAgABC9AQAAzgIAML4BAQAAAAHDAQEApQIAIcQBQACoAgAh1gFAAKgCACHbAQAAzwLbASLcAQgA0AIAId0BAQClAgAh3gEBAKUCACECAAAAIgAgGAAAggMAIAIAAAD-AgAgGAAA_wIAIAu7AQAA_QIAMLwBAAD-AgAQvQEAAP0CADC-AQEApQIAIcMBAQClAgAhxAFAAKgCACHWAUAAqAIAIdsBAADPAtsBItwBCADQAgAh3QEBAKUCACHeAQEApQIAIQu7AQAA_QIAMLwBAAD-AgAQvQEAAP0CADC-AQEApQIAIcMBAQClAgAhxAFAAKgCACHWAUAAqAIAIdsBAADPAtsBItwBCADQAgAh3QEBAKUCACHeAQEApQIAIQe-AQEA5QIAIcMBAQDlAgAhxAFAAOgCACHWAUAA6AIAIdsBAACAA9sBItwBCACBAwAh3QEBAOUCACEBgwIAAADbAQIFgwIIAAAAAYkCCAAAAAGKAggAAAABiwIIAAAAAYwCCAAAAAEKCgAAgwMAIAsAAIQDACAOAACFAwAgvgEBAOUCACHDAQEA5QIAIcQBQADoAgAh1gFAAOgCACHbAQAAgAPbASLcAQgAgQMAId0BAQDlAgAhBR8AAOsEACAgAAD0BAAggAIAAOwEACCBAgAA8wQAIIYCAAABACALHwAAiwMAMCAAAJADADCAAgAAjAMAMIECAACNAwAwggIAAI4DACCDAgAAjwMAMIQCAACPAwAwhQIAAI8DADCGAgAAjwMAMIcCAACRAwAwiAIAAJIDADAHHwAAhgMAICAAAIkDACCAAgAAhwMAIIECAACIAwAghAIAABgAIIUCAAAYACCGAgAAHAAgCAoAAO4CACANAADtAgAgvgEBAAAAAb8BAgAAAAHAAQEAAAABwgEBAAAAAcMBAQAAAAHEAUAAAAABAgAAABwAIB8AAIYDACADAAAAGAAgHwAAhgMAICAAAIoDACAKAAAAGAAgCgAA6wIAIA0AAOoCACAYAACKAwAgvgEBAOUCACG_AQIA5gIAIcABAQDnAgAhwgEBAOUCACHDAQEA5QIAIcQBQADoAgAhCAoAAOsCACANAADqAgAgvgEBAOUCACG_AQIA5gIAIcABAQDnAgAhwgEBAOUCACHDAQEA5QIAIcQBQADoAgAhBg0AAJgDACC-AQEAAAABwgEBAAAAAd8BAgAAAAHgAQEAAAAB4QEIAAAAAQIAAAAVACAfAACXAwAgAwAAABUAIB8AAJcDACAgAACVAwAgARgAAPIEADALDAAA1gIAIA0AANcCACC7AQAA2AIAMLwBAAATABC9AQAA2AIAML4BAQAAAAHBAQEApQIAIcIBAQClAgAh3wECANUCACHgAQEApQIAIeEBCADQAgAhAgAAABUAIBgAAJUDACACAAAAkwMAIBgAAJQDACAJuwEAAJIDADC8AQAAkwMAEL0BAACSAwAwvgEBAKUCACHBAQEApQIAIcIBAQClAgAh3wECANUCACHgAQEApQIAIeEBCADQAgAhCbsBAACSAwAwvAEAAJMDABC9AQAAkgMAML4BAQClAgAhwQEBAKUCACHCAQEApQIAId8BAgDVAgAh4AEBAKUCACHhAQgA0AIAIQW-AQEA5QIAIcIBAQDlAgAh3wECAOYCACHgAQEA5QIAIeEBCACBAwAhBg0AAJYDACC-AQEA5QIAIcIBAQDlAgAh3wECAOYCACHgAQEA5QIAIeEBCACBAwAhBR8AAO0EACAgAADwBAAggAIAAO4EACCBAgAA7wQAIIYCAAAPACAGDQAAmAMAIL4BAQAAAAHCAQEAAAAB3wECAAAAAeABAQAAAAHhAQgAAAABAx8AAO0EACCAAgAA7gQAIIYCAAAPACAKCgAAmgMAIAsAAJsDACAOAACcAwAgvgEBAAAAAcMBAQAAAAHEAUAAAAAB1gFAAAAAAdsBAAAA2wEC3AEIAAAAAd0BAQAAAAEDHwAA6wQAIIACAADsBAAghgIAAAEAIAQfAACLAwAwgAIAAIwDADCCAgAAjgMAIIYCAACPAwAwAx8AAIYDACCAAgAAhwMAIIYCAAAcACANCQAAxAMAIA8AAMUDACAQAADGAwAgvgEBAAAAAcQBQAAAAAHSAQEAAAAB1gFAAAAAAeIBAQAAAAHjAQgAAAAB5AEBAAAAAeYBAAAA5gEC5wEgAAAAAegBAQAAAAECAAAADwAgHwAAwwMAIAMAAAAPACAfAADDAwAgIAAAqAMAIAEYAADqBAAwEgYAANECACAJAADbAgAgDwAA0gIAIBAAAM0CACC7AQAA2QIAMLwBAAANABC9AQAA2QIAML4BAQAAAAHEAUAAqAIAIdIBAQCmAgAh1gFAAKgCACHeAQEApQIAIeIBAQClAgAh4wEIANACACHkAQEApgIAIeYBAADaAuYBIucBIACnAgAh6AEBAKUCACECAAAADwAgGAAAqAMAIAIAAAClAwAgGAAApgMAIA67AQAApAMAMLwBAAClAwAQvQEAAKQDADC-AQEApQIAIcQBQACoAgAh0gEBAKYCACHWAUAAqAIAId4BAQClAgAh4gEBAKUCACHjAQgA0AIAIeQBAQCmAgAh5gEAANoC5gEi5wEgAKcCACHoAQEApQIAIQ67AQAApAMAMLwBAAClAwAQvQEAAKQDADC-AQEApQIAIcQBQACoAgAh0gEBAKYCACHWAUAAqAIAId4BAQClAgAh4gEBAKUCACHjAQgA0AIAIeQBAQCmAgAh5gEAANoC5gEi5wEgAKcCACHoAQEApQIAIQq-AQEA5QIAIcQBQADoAgAh0gEBAOcCACHWAUAA6AIAIeIBAQDlAgAh4wEIAIEDACHkAQEA5wIAIeYBAACnA-YBIucBIADyAgAh6AEBAOUCACEBgwIAAADmAQINCQAAqQMAIA8AAKoDACAQAACrAwAgvgEBAOUCACHEAUAA6AIAIdIBAQDnAgAh1gFAAOgCACHiAQEA5QIAIeMBCACBAwAh5AEBAOcCACHmAQAApwPmASLnASAA8gIAIegBAQDlAgAhBR8AAN4EACAgAADoBAAggAIAAN8EACCBAgAA5wQAIIYCAACIAQAgCx8AALgDADAgAAC8AwAwgAIAALkDADCBAgAAugMAMIICAAC7AwAggwIAAI8DADCEAgAAjwMAMIUCAACPAwAwhgIAAI8DADCHAgAAvQMAMIgCAACSAwAwCx8AAKwDADAgAACxAwAwgAIAAK0DADCBAgAArgMAMIICAACvAwAggwIAALADADCEAgAAsAMAMIUCAACwAwAwhgIAALADADCHAgAAsgMAMIgCAACzAwAwCAoAAO4CACAMAADsAgAgvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcMBAQAAAAHEAUAAAAABAgAAABwAIB8AALcDACADAAAAHAAgHwAAtwMAICAAALYDACABGAAA5gQAMA0KAACpAgAgDAAA1gIAIA0AANcCACC7AQAA1AIAMLwBAAAYABC9AQAA1AIAML4BAQAAAAG_AQIA1QIAIcABAQCmAgAhwQEBAAAAAcIBAQClAgAhwwEBAKUCACHEAUAAqAIAIQIAAAAcACAYAAC2AwAgAgAAALQDACAYAAC1AwAgCrsBAACzAwAwvAEAALQDABC9AQAAswMAML4BAQClAgAhvwECANUCACHAAQEApgIAIcEBAQClAgAhwgEBAKUCACHDAQEApQIAIcQBQACoAgAhCrsBAACzAwAwvAEAALQDABC9AQAAswMAML4BAQClAgAhvwECANUCACHAAQEApgIAIcEBAQClAgAhwgEBAKUCACHDAQEApQIAIcQBQACoAgAhBr4BAQDlAgAhvwECAOYCACHAAQEA5wIAIcEBAQDlAgAhwwEBAOUCACHEAUAA6AIAIQgKAADrAgAgDAAA6QIAIL4BAQDlAgAhvwECAOYCACHAAQEA5wIAIcEBAQDlAgAhwwEBAOUCACHEAUAA6AIAIQgKAADuAgAgDAAA7AIAIL4BAQAAAAG_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_AQIAAAABwAEBAAAAAcEBAQAAAAHCAQEAAAABxAFAAAAAAQoGAADTAwAgCwAAmwMAIA4AAJwDACC-AQEAAAABxAFAAAAAAdYBQAAAAAHbAQAAANsBAtwBCAAAAAHdAQEAAAAB3gEBAAAAAQIAAAAiACAfAACXBAAgAwAAACIAIB8AAJcEACAgAACWBAAgARgAAMUEADACAAAAIgAgGAAAlgQAIAIAAAD-AgAgGAAAlQQAIAe-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_BAAgBgYAALwEACAJAADCBAAgDwAAvgQAIBAAAL0EACDSAQAA3wIAIOQBAADfAgAgAQcAAMsDACAHvgEBAAAAAcQBQAAAAAHWAUAAAAAB7AFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAQy-AQEAAAABxAFAAAAAAdYBQAAAAAHeAQEAAAAB7QEBAAAAAe4BAQAAAAHvAQEAAAAB8AEBAAAAAfEBQAAAAAHyAUAAAAAB8wEBAAAAAfQBAQAAAAEHvgEBAAAAAcQBQAAAAAHWAUAAAAAB2wEAAADbAQLcAQgAAAAB3QEBAAAAAd4BAQAAAAEGvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcIBAQAAAAHEAUAAAAABDgUAALYEACAQAAC5BAAgEQAAuAQAIBIAALcEACC-AQEAAAABxAFAAAAAAdQBAQAAAAHWAUAAAAAB2wEAAAD-AQPiAQEAAAAB-AEBAAAAAfkBIAAAAAH6AQEAAAAB_AEAAAD8AQMCAAAAAQAgHwAAxwQAIAMAAAAtACAfAADHBAAgIAAAywQAIBAAAAAtACAFAACCBAAgEAAAhQQAIBEAAIQEACASAACDBAAgGAAAywQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMOBQAAggQAIBAAAIUEACARAACEBAAgEgAAgwQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMOBAAAtQQAIBAAALkEACARAAC4BAAgEgAAtwQAIL4BAQAAAAHEAUAAAAAB1AEBAAAAAdYBQAAAAAHbAQAAAP4BA-IBAQAAAAH4AQEAAAAB-QEgAAAAAfoBAQAAAAH8AQAAAPwBAwIAAAABACAfAADMBAAgAwAAAC0AIB8AAMwEACAgAADQBAAgEAAAAC0AIAQAAIEEACAQAACFBAAgEQAAhAQAIBIAAIMEACAYAADQBAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIw4EAACBBAAgEAAAhQQAIBEAAIQEACASAACDBAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIwq-AQEAAAABxAFAAAAAAdIBAQAAAAHWAUAAAAAB3gEBAAAAAeIBAQAAAAHjAQgAAAAB5AEBAAAAAeYBAAAA5gEC5wEgAAAAAQsDAADHAwAgEQAAyQMAIL4BAQAAAAHEAUAAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVASAAAAAB1gFAAAAAAQIAAADjAQAgHwAA0gQAIAMAAAALACAfAADSBAAgIAAA1gQAIA0AAAALACADAADzAgAgEQAA9QIAIBgAANYEACC-AQEA5QIAIcQBQADoAgAh0AEBAOUCACHRAQEA5QIAIdIBAQDnAgAh0wEBAOUCACHUAQEA5QIAIdUBIADyAgAh1gFAAOgCACELAwAA8wIAIBEAAPUCACC-AQEA5QIAIcQBQADoAgAh0AEBAOUCACHRAQEA5QIAIdIBAQDnAgAh0wEBAOUCACHUAQEA5QIAIdUBIADyAgAh1gFAAOgCACELAwAAxwMAIAcAAMgDACC-AQEAAAABxAFAAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQAAAAHUAQEAAAAB1QEgAAAAAdYBQAAAAAECAAAA4wEAIB8AANcEACADAAAACwAgHwAA1wQAICAAANsEACANAAAACwAgAwAA8wIAIAcAAPQCACAYAADbBAAgvgEBAOUCACHEAUAA6AIAIdABAQDlAgAh0QEBAOUCACHSAQEA5wIAIdMBAQDlAgAh1AEBAOUCACHVASAA8gIAIdYBQADoAgAhCwMAAPMCACAHAAD0AgAgvgEBAOUCACHEAUAA6AIAIdABAQDlAgAh0QEBAOUCACHSAQEA5wIAIdMBAQDlAgAh1AEBAOUCACHVASAA8gIAIdYBQADoAgAhDgQAALUEACAFAAC2BAAgEAAAuQQAIBEAALgEACC-AQEAAAABxAFAAAAAAdQBAQAAAAHWAUAAAAAB2wEAAAD-AQPiAQEAAAAB-AEBAAAAAfkBIAAAAAH6AQEAAAAB_AEAAAD8AQMCAAAAAQAgHwAA3AQAIAW-AQEAAAABxAFAAAAAAdYBQAAAAAHiAQEAAAAB6QEBAAAAAQIAAACIAQAgHwAA3gQAIAsGAADTAwAgCgAAmgMAIA4AAJwDACC-AQEAAAABwwEBAAAAAcQBQAAAAAHWAUAAAAAB2wEAAADbAQLcAQgAAAAB3QEBAAAAAd4BAQAAAAECAAAAIgAgHwAA4AQAIAMAAAAgACAfAADgBAAgIAAA5AQAIA0AAAAgACAGAADSAwAgCgAAgwMAIA4AAIUDACAYAADkBAAgvgEBAOUCACHDAQEA5QIAIcQBQADoAgAh1gFAAOgCACHbAQAAgAPbASLcAQgAgQMAId0BAQDlAgAh3gEBAOUCACELBgAA0gMAIAoAAIMDACAOAACFAwAgvgEBAOUCACHDAQEA5QIAIcQBQADoAgAh1gFAAOgCACHbAQAAgAPbASLcAQgAgQMAId0BAQDlAgAh3gEBAOUCACEFvgEBAAAAAcEBAQAAAAHfAQIAAAAB4AEBAAAAAeEBCAAAAAEGvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcMBAQAAAAHEAUAAAAABAwAAAIsBACAfAADeBAAgIAAA6QQAIAcAAACLAQAgGAAA6QQAIL4BAQDlAgAhxAFAAOgCACHWAUAA6AIAIeIBAQDlAgAh6QEBAOUCACEFvgEBAOUCACHEAUAA6AIAIdYBQADoAgAh4gEBAOUCACHpAQEA5QIAIQq-AQEAAAABxAFAAAAAAdIBAQAAAAHWAUAAAAAB4gEBAAAAAeMBCAAAAAHkAQEAAAAB5gEAAADmAQLnASAAAAAB6AEBAAAAAQ4EAAC1BAAgBQAAtgQAIBAAALkEACASAAC3BAAgvgEBAAAAAcQBQAAAAAHUAQEAAAAB1gFAAAAAAdsBAAAA_gED4gEBAAAAAfgBAQAAAAH5ASAAAAAB-gEBAAAAAfwBAAAA_AEDAgAAAAEAIB8AAOsEACAOBgAA3wMAIAkAAMQDACAQAADGAwAgvgEBAAAAAcQBQAAAAAHSAQEAAAAB1gFAAAAAAd4BAQAAAAHiAQEAAAAB4wEIAAAAAeQBAQAAAAHmAQAAAOYBAucBIAAAAAHoAQEAAAABAgAAAA8AIB8AAO0EACADAAAADQAgHwAA7QQAICAAAPEEACAQAAAADQAgBgAA3gMAIAkAAKkDACAQAACrAwAgGAAA8QQAIL4BAQDlAgAhxAFAAOgCACHSAQEA5wIAIdYBQADoAgAh3gEBAOUCACHiAQEA5QIAIeMBCACBAwAh5AEBAOcCACHmAQAApwPmASLnASAA8gIAIegBAQDlAgAhDgYAAN4DACAJAACpAwAgEAAAqwMAIL4BAQDlAgAhxAFAAOgCACHSAQEA5wIAIdYBQADoAgAh3gEBAOUCACHiAQEA5QIAIeMBCACBAwAh5AEBAOcCACHmAQAApwPmASLnASAA8gIAIegBAQDlAgAhBb4BAQAAAAHCAQEAAAAB3wECAAAAAeABAQAAAAHhAQgAAAABAwAAAC0AIB8AAOsEACAgAAD1BAAgEAAAAC0AIAQAAIEEACAFAACCBAAgEAAAhQQAIBIAAIMEACAYAAD1BAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIw4EAACBBAAgBQAAggQAIBAAAIUEACASAACDBAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIwe-AQEAAAABwwEBAAAAAcQBQAAAAAHWAUAAAAAB2wEAAADbAQLcAQgAAAAB3QEBAAAAAQMAAAAtACAfAADcBAAgIAAA-QQAIBAAAAAtACAEAACBBAAgBQAAggQAIBAAAIUEACARAACEBAAgGAAA-QQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMOBAAAgQQAIAUAAIIEACAQAACFBAAgEQAAhAQAIL4BAQDlAgAhxAFAAOgCACHUAQEA5wIAIdYBQADoAgAh2wEAAIAE_gEj4gEBAOUCACH4AQEA5QIAIfkBIADyAgAh-gEBAOcCACH8AQAA_wP8ASMOBAAAtQQAIAUAALYEACARAAC4BAAgEgAAtwQAIL4BAQAAAAHEAUAAAAAB1AEBAAAAAdYBQAAAAAHbAQAAAP4BA-IBAQAAAAH4AQEAAAAB-QEgAAAAAfoBAQAAAAH8AQAAAPwBAwIAAAABACAfAAD6BAAgDgYAAN8DACAJAADEAwAgDwAAxQMAIL4BAQAAAAHEAUAAAAAB0gEBAAAAAdYBQAAAAAHeAQEAAAAB4gEBAAAAAeMBCAAAAAHkAQEAAAAB5gEAAADmAQLnASAAAAAB6AEBAAAAAQIAAAAPACAfAAD8BAAgCwYAANMDACAKAACaAwAgCwAAmwMAIL4BAQAAAAHDAQEAAAABxAFAAAAAAdYBQAAAAAHbAQAAANsBAtwBCAAAAAHdAQEAAAAB3gEBAAAAAQIAAAAiACAfAAD-BAAgAwAAAC0AIB8AAPoEACAgAACCBQAgEAAAAC0AIAQAAIEEACAFAACCBAAgEQAAhAQAIBIAAIMEACAYAACCBQAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIw4EAACBBAAgBQAAggQAIBEAAIQEACASAACDBAAgvgEBAOUCACHEAUAA6AIAIdQBAQDnAgAh1gFAAOgCACHbAQAAgAT-ASPiAQEA5QIAIfgBAQDlAgAh-QEgAPICACH6AQEA5wIAIfwBAAD_A_wBIwMAAAANACAfAAD8BAAgIAAAhQUAIBAAAAANACAGAADeAwAgCQAAqQMAIA8AAKoDACAYAACFBQAgvgEBAOUCACHEAUAA6AIAIdIBAQDnAgAh1gFAAOgCACHeAQEA5QIAIeIBAQDlAgAh4wEIAIEDACHkAQEA5wIAIeYBAACnA-YBIucBIADyAgAh6AEBAOUCACEOBgAA3gMAIAkAAKkDACAPAACqAwAgvgEBAOUCACHEAUAA6AIAIdIBAQDnAgAh1gFAAOgCACHeAQEA5QIAIeIBAQDlAgAh4wEIAIEDACHkAQEA5wIAIeYBAACnA-YBIucBIADyAgAh6AEBAOUCACEDAAAAIAAgHwAA_gQAICAAAIgFACANAAAAIAAgBgAA0gMAIAoAAIMDACALAACEAwAgGAAAiAUAIL4BAQDlAgAhwwEBAOUCACHEAUAA6AIAIdYBQADoAgAh2wEAAIAD2wEi3AEIAIEDACHdAQEA5QIAId4BAQDlAgAhCwYAANIDACAKAACDAwAgCwAAhAMAIL4BAQDlAgAhwwEBAOUCACHEAUAA6AIAIdYBQADoAgAh2wEAAIAD2wEi3AEIAIEDACHdAQEA5QIAId4BAQDlAgAhBgQGAgUKAwgADhAnChEmCRIMBAEDAAEBAwABBAMAAQcQBQgADREjCQUGAAQIAAwJAAYPFggQHQoCBxEFCAAHAQcSAAIMAAkNAAUFBgAECAALCgABCxcIDhkKAwoAAQwACQ0ABQELGgACDx4AEB8AAgckABElAAQEKAAFKQAQKwARKgAAAAADCAATJQAUJgAVAAAAAwgAEyUAFCYAFQEDAAEBAwABAwgAGiUAGyYAHAAAAAMIABolABsmABwBAwABAQMAAQMIACElACImACMAAAADCAAhJQAiJgAjAAAAAwgAKSUAKiYAKwAAAAMIACklAComACsAAAMIADAlADEmADIAAAADCAAwJQAxJgAyAgYABAkABgIGAAQJAAYFCAA3JQA6JgA7dwA4eAA5AAAAAAAFCAA3JQA6JgA7dwA4eAA5AgwACQ0ABQIMAAkNAAUFCABAJQBDJgBEdwBBeABCAAAAAAAFCABAJQBDJgBEdwBBeABCAgYABAoAAQIGAAQKAAEFCABJJQBMJgBNdwBKeABLAAAAAAAFCABJJQBMJgBNdwBKeABLAQMAAQEDAAEDCABSJQBTJgBUAAAAAwgAUiUAUyYAVAMKAAEMAAkNAAUDCgABDAAJDQAFBQgAWSUAXCYAXXcAWngAWwAAAAAABQgAWSUAXCYAXXcAWngAWxMCARQsARUvARYwARcxARkzARo1Dxs2EBw4AR06Dx47ESE8ASI9ASM-DydBEihCFilDAipEAitFAixGAi1HAi5JAi9LDzBMFzFOAjJQDzNRGDRSAjVTAjZUDzdXGThYHTlZAzpaAztbAzxcAz1dAz5fAz9hD0BiHkFkA0JmD0NnH0RoA0VpA0ZqD0dtIEhuJElwJUpxJUt0JUx1JU12JU54JU96D1B7JlF9JVJ_D1OAASdUgQElVYIBJVaDAQ9XhgEoWIcBLFmJAQZaigEGW40BBlyOAQZdjwEGXpEBBl-TAQ9glAEtYZYBBmKYAQ9jmQEuZJoBBmWbAQZmnAEPZ58BL2igATNpoQEFaqIBBWujAQVspAEFbaUBBW6nAQVvqQEPcKoBNHGsAQVyrgEPc68BNXSwAQV1sQEFdrIBD3m1ATZ6tgE8e7cBCHy4AQh9uQEIfroBCH-7AQiAAb0BCIEBvwEPggHAAT2DAcIBCIQBxAEPhQHFAT6GAcYBCIcBxwEIiAHIAQ-JAcsBP4oBzAFFiwHNAQmMAc4BCY0BzwEJjgHQAQmPAdEBCZAB0wEJkQHVAQ-SAdYBRpMB2AEJlAHaAQ-VAdsBR5YB3AEJlwHdAQmYAd4BD5kB4QFImgHiAU6bAeQBBJwB5QEEnQHnAQSeAegBBJ8B6QEEoAHrAQShAe0BD6IB7gFPowHwAQSkAfIBD6UB8wFQpgH0AQSnAfUBBKgB9gEPqQH5AVGqAfoBVasB-wEKrAH8AQqtAf0BCq4B_gEKrwH_AQqwAYECCrEBgwIPsgGEAlazAYYCCrQBiAIPtQGJAle2AYoCCrcBiwIKuAGMAg-5AY8CWLoBkAJe"
};
async function decodeBase64AsWasm2(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm2(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass2() {
  return runtime3.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports2 = {};
__export(prismaNamespace_exports2, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull3,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull3,
  Decimal: () => Decimal3,
  JsonNull: () => JsonNull3,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes4,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError3,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError3,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError3,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError3,
  PrismaClientValidationError: () => PrismaClientValidationError3,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql3,
  TransactionIsolationLevel: () => TransactionIsolationLevel2,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension2,
  empty: () => empty3,
  getExtensionContext: () => getExtensionContext2,
  join: () => join3,
  prismaVersion: () => prismaVersion,
  raw: () => raw3,
  sql: () => sql
});
import * as runtime4 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError3 = runtime4.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError3 = runtime4.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError3 = runtime4.PrismaClientRustPanicError;
var PrismaClientInitializationError3 = runtime4.PrismaClientInitializationError;
var PrismaClientValidationError3 = runtime4.PrismaClientValidationError;
var sql = runtime4.sqltag;
var empty3 = runtime4.empty;
var join3 = runtime4.join;
var raw3 = runtime4.raw;
var Sql3 = runtime4.Sql;
var Decimal3 = runtime4.Decimal;
var getExtensionContext2 = runtime4.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.4.0",
  engine: "ab56fe763f921d033a6c195e7ddeb3e255bdbb57"
};
var NullTypes4 = {
  DbNull: runtime4.NullTypes.DbNull,
  JsonNull: runtime4.NullTypes.JsonNull,
  AnyNull: runtime4.NullTypes.AnyNull
};
var DbNull3 = runtime4.DbNull;
var JsonNull3 = runtime4.JsonNull;
var AnyNull3 = runtime4.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Meal: "Meal",
  OrderItem: "OrderItem",
  Order: "Order",
  ProviderProfile: "ProviderProfile",
  Review: "Review"
};
var TransactionIsolationLevel2 = runtime4.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  phone: "phone",
  role: "role",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  imageUrl: "imageUrl",
  dietaryType: "dietaryType",
  isAvailable: "isAvailable",
  providerId: "providerId",
  categoryId: "categoryId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  quantity: "quantity",
  mealName: "mealName",
  mealPrice: "mealPrice",
  orderId: "orderId",
  mealId: "mealId"
};
var OrderScalarFieldEnum = {
  id: "id",
  status: "status",
  totalPrice: "totalPrice",
  deliveryAddress: "deliveryAddress",
  customerId: "customerId",
  providerId: "providerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  restaurantName: "restaurantName",
  description: "description",
  address: "address",
  phone: "phone",
  isOpen: "isOpen",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  orderId: "orderId",
  mealId: "mealId",
  customerId: "customerId",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension2 = runtime4.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole3 = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN"
};
var OrderStatus2 = {
  PLACED: "PLACED",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath2(import.meta.url));
var PrismaClient2 = getPrismaClientClass2();

// src/middleware/globalErrorHandle.ts
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";
  const isDev = process.env.NODE_ENV !== "production";
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
  } else if (err instanceof prismaNamespace_exports2.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate value already exists";
        break;
      case "P2003":
        statusCode = 400;
        message = "Invalid reference provided";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      default:
        statusCode = 400;
        message = "Database request error";
    }
  } else if (err instanceof prismaNamespace_exports2.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data format provided";
  } else if (err instanceof prismaNamespace_exports2.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database connection failed";
  } else if (err instanceof prismaNamespace_exports2.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unexpected database error";
  } else if (err instanceof Error) {
    message = err.message || message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    ...isDev && { error: err }
  });
};
var globalErrorHandle_default = globalErrorHandler;

// src/modules/user/user.routes.ts
import { Router as Router2 } from "express";

// src/modules/user/user.service.ts
var getMyProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};
var updateMyProfile = async (userId, data) => {
  const allowedFields = ["name", "image", "phone"];
  const updateData = {};
  for (const key of allowedFields) {
    if (data[key] !== void 0) {
      updateData[key] = data[key];
    }
  }
  return await prisma.user.update({
    where: {
      id: userId
    },
    data: updateData
  });
};
var getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    },
    where: {
      role: {
        in: ["CUSTOMER", "PROVIDER"]
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateUserStatus = async (userId, status2) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.role === "ADMIN") {
    throw new AppError(403, "Admin status cannot be changed");
  }
  return await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: status2
    }
  });
};
var updateUserRoleToProvider = async (userId, role) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { role: UserRole3.PROVIDER }
    });
    const existingProvider = await tx.providerProfile.findFirst({
      where: { userId }
    });
    if (!existingProvider) {
      await tx.providerProfile.create({
        data: {
          userId,
          isOpen: true,
          restaurantName: "",
          description: "",
          address: "",
          phone: ""
        }
      });
    }
    return updatedUser;
  });
};
var userService = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserStatus,
  updateUserRoleToProvider
};

// src/modules/user/user.controller.ts
var getMyProfile2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const result = await userService.getMyProfile(req.user.id);
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var UpdateMyProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const result = await userService.updateMyProfile(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: " Profile updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllUsers2 = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var UpdateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status: status2 } = req.body;
    if (!status2 || !["ACTIVE", "SUSPENDED"].includes(status2)) {
      throw new AppError(400, "Invalid status");
    }
    const result = await userService.updateUserStatus(userId, status2);
    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateUserRoleToProvider2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (role === "PROVIDER" /* provider */) {
      const result = await userService.updateUserRoleToProvider(userId, role);
      return res.status(200).json({
        success: true,
        message: "Provider created successfully",
        data: result
      });
    }
  } catch (error) {
    next(error);
  }
};
var userController = {
  getMyProfile: getMyProfile2,
  UpdateMyProfile,
  getAllUsers: getAllUsers2,
  UpdateUserStatus,
  updateUserRoleToProvider: updateUserRoleToProvider2
};

// src/modules/user/user.routes.ts
var router2 = Router2();
router2.get("/users/me", authMiddleware(), userController.getMyProfile);
router2.patch("/users/me", authMiddleware(), userController.UpdateMyProfile);
router2.patch("/users/:userId/role", userController.updateUserRoleToProvider);
router2.get("/users/admin/users", authMiddleware("ADMIN" /* admin */), userController.getAllUsers);
router2.patch(
  "/users/admin/users/:userId/status",
  authMiddleware("ADMIN" /* admin */),
  userController.UpdateUserStatus
);
var userRoute = router2;

// src/modules/provider/provider.routes.ts
import { Router as Router3 } from "express";

// src/modules/provider/provider.service.ts
var createProvider = async (id) => {
  if (!id) {
    throw new AppError(401, "Unauthorized access");
  }
  const user = await prisma.user.findFirst({
    where: {
      id
    }
  });
  if (!user) {
    throw new AppError(404, "Provider not found");
  }
  const result = await prisma.providerProfile.create({
    data: {
      userId: user.id,
      isOpen: true,
      restaurantName: "",
      description: "",
      address: "",
      phone: ""
    }
  });
  return result;
};
var getAllProviders = async () => {
  const result = await prisma.providerProfile.findMany({
    where: {
      isOpen: true,
      user: {
        status: "ACTIVE"
      }
    }
  });
  return result;
};
var getMyProfile3 = async (userId) => {
  if (!userId) {
    throw new AppError(401, "Unauthorized access");
  }
  const result = await prisma.providerProfile.findFirst({
    where: {
      userId,
      user: {
        status: "ACTIVE"
      }
    }
  });
  if (!result) {
    throw new AppError(404, "Provider not found");
  }
  return result;
};
var updateMyProfile2 = async (userId, data) => {
  if (!userId) {
    throw new AppError(401, "Unauthorized access");
  }
  const result = await prisma.providerProfile.findFirst({
    where: {
      userId
    }
  });
  if (!result) {
    throw new AppError(404, "Provider not found");
  }
  const updated = await prisma.providerProfile.update({
    where: {
      id: result.id
    },
    data
  });
  return updated;
};
var getProviderProfileWithMeals = async (providerId) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  const provider = await prisma.providerProfile.findFirst({
    where: {
      id: providerId,
      isOpen: true,
      user: {
        status: "ACTIVE"
      }
    },
    include: {
      meals: {
        where: {
          isAvailable: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  if (!provider) {
    throw new AppError(404, "Provider not found or not available");
  }
  return provider;
};
var getIncomingOrders = async (providerId) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  return prisma.order.findMany({
    where: {
      providerId,
      status: {
        in: [OrderStatus2.PLACED, OrderStatus2.PREPARING, OrderStatus2.READY]
      }
    },
    include: {
      items: {
        include: { meal: true }
      },
      customer: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getProviderAllOrders = async (providerId) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  return prisma.order.findMany({
    where: {
      providerId,
      status: {
        in: [OrderStatus2.CANCELLED, OrderStatus2.DELIVERED]
      }
    },
    include: {
      items: {
        include: { meal: true }
      },
      customer: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateMeal = async (providerId, mealId, data) => {
  if (!providerId || !mealId) {
    throw new AppError(400, "Provider ID and Meal ID are required");
  }
  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId
    }
  });
  if (!meal) {
    throw new AppError(404, "Meal not found or unauthorized");
  }
  return prisma.meal.update({
    where: { id: mealId },
    data
  });
};
var deleteMeal = async (providerId, mealId) => {
  if (!providerId || !mealId) {
    throw new AppError(400, "Provider ID and Meal ID are required");
  }
  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId
    }
  });
  if (!meal) {
    throw new AppError(404, "Meal not found or unauthorized");
  }
  return prisma.meal.delete({
    where: { id: mealId }
  });
};
var updateOrderStatus = async (providerId, orderId, newStatus) => {
  if (!providerId || !orderId) {
    throw new AppError(400, "Provider ID and Order ID are required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      providerId
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found or unauthorized");
  }
  if (order.status === newStatus) {
    throw new AppError(400, "Order status already updated");
  }
  const validTransitions = {
    PLACED: [OrderStatus2.PREPARING],
    PREPARING: [OrderStatus2.READY],
    READY: [OrderStatus2.DELIVERED],
    DELIVERED: [],
    CANCELLED: []
  };
  if (!validTransitions[order.status].includes(newStatus)) {
    throw new AppError(400, "Invalid order status transition");
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });
};
var ProviderService = {
  createProvider,
  getAllProviders,
  getMyProfile: getMyProfile3,
  updateMyProfile: updateMyProfile2,
  getProviderProfileWithMeals,
  getIncomingOrders,
  getProviderAllOrders,
  updateMeal,
  deleteMeal,
  updateOrderStatus
};

// src/modules/provider/provider.controller.ts
var createProvider2 = async (req, res, next) => {
  try {
    const result = await ProviderService.createProvider(req.body);
    res.status(201).json({
      success: true,
      message: "Provider created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllProviders2 = async (req, res, next) => {
  try {
    const result = await ProviderService.getAllProviders();
    res.status(201).json({
      success: true,
      message: "All providers retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyProfile4 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const result = await ProviderService.getMyProfile(req.user.id);
    res.status(201).json({
      success: true,
      message: "Provider profile retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateMyProfile3 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    if (req.user.role !== UserRole3.PROVIDER) {
      throw new AppError(403, "Only provider can update provider profile");
    }
    const result = await ProviderService.updateMyProfile(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Provider profile updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getProviderProfileWithMeals2 = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    if (!providerId) {
      throw new AppError(400, "Provider ID is required");
    }
    const result = await ProviderService.getProviderProfileWithMeals(providerId);
    res.status(201).json({
      success: true,
      message: "Provider profile with meals retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getIncomingOrders2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    if (req.user.role !== UserRole3.PROVIDER) {
      throw new AppError(403, "Only providers can view orders");
    }
    const provider = await prisma.providerProfile.findFirst({
      where: { userId: req.user.id }
    });
    if (!provider) {
      throw new AppError(404, "Provider profile not found");
    }
    const result = await ProviderService.getIncomingOrders(provider.id);
    res.status(200).json({
      success: true,
      message: "Incoming orders retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getProviderAllOrders2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    if (req.user.role !== UserRole3.PROVIDER) {
      throw new AppError(403, "Only providers can view orders");
    }
    const provider = await prisma.providerProfile.findFirst({
      where: { userId: req.user.id }
    });
    if (!provider) {
      throw new AppError(404, "Provider profile not found");
    }
    const result = await ProviderService.getProviderAllOrders(provider.id);
    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateOrderStatus2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    if (req.user.role !== UserRole3.PROVIDER) {
      throw new AppError(403, "Only providers can update order status");
    }
    const { orderId } = req.params;
    const { status: status2 } = req.body;
    if (!orderId || !status2) {
      throw new AppError(400, "Order ID and status are required");
    }
    const provider = await prisma.providerProfile.findFirst({
      where: { userId: req.user.id }
    });
    if (!provider) {
      throw new AppError(404, "Provider profile not found");
    }
    const result = await ProviderService.updateOrderStatus(provider.id, orderId, status2);
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateMeal2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    if (req.user.role !== UserRole3.PROVIDER) {
      throw new AppError(403, "Only providers can update meals");
    }
    const { mealId } = req.params;
    if (!mealId) {
      throw new AppError(400, "Meal ID is required");
    }
    const provider = await prisma.providerProfile.findFirst({
      where: { userId: req.user.id }
    });
    if (!provider) {
      throw new AppError(404, "Provider profile not found");
    }
    const result = await ProviderService.updateMeal(provider.id, mealId, req.body);
    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteMeal2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    if (req.user.role !== UserRole3.PROVIDER) {
      throw new AppError(403, "Only providers can delete meals");
    }
    const { mealId } = req.params;
    if (!mealId) {
      throw new AppError(400, "Meal ID is required");
    }
    const provider = await prisma.providerProfile.findFirst({
      where: { userId: req.user.id }
    });
    if (!provider) {
      throw new AppError(404, "Provider profile not found");
    }
    const result = await ProviderService.deleteMeal(provider.id, mealId);
    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var ProviderController = {
  createProvider: createProvider2,
  getIncomingOrders: getIncomingOrders2,
  getProviderAllOrders: getProviderAllOrders2,
  updateOrderStatus: updateOrderStatus2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2,
  getAllProviders: getAllProviders2,
  getMyProfile: getMyProfile4,
  updateMyProfile: updateMyProfile3,
  getProviderProfileWithMeals: getProviderProfileWithMeals2
};

// src/modules/provider/provider.routes.ts
var router3 = Router3();
router3.post("/providers", ProviderController.createProvider);
router3.get("/providers", ProviderController.getAllProviders);
router3.get("/provider/me", authMiddleware("PROVIDER" /* provider */), ProviderController.getMyProfile);
router3.get("/providers/:providerId", ProviderController.getProviderProfileWithMeals);
router3.get(
  "/provider/orders",
  authMiddleware("PROVIDER" /* provider */),
  ProviderController.getIncomingOrders
);
router3.get(
  "/provider/all-orders",
  authMiddleware("PROVIDER" /* provider */),
  ProviderController.getProviderAllOrders
);
router3.patch(
  "/provider/meals/:mealId",
  authMiddleware("PROVIDER" /* provider */),
  ProviderController.updateMeal
);
router3.patch("/provider/me", authMiddleware("PROVIDER" /* provider */), ProviderController.updateMyProfile);
router3.patch(
  "/provider/orders/:orderId/status",
  authMiddleware("PROVIDER" /* provider */),
  ProviderController.updateOrderStatus
);
router3.delete(
  "/provider/meals/:mealId",
  authMiddleware("PROVIDER" /* provider */),
  ProviderController.deleteMeal
);
var providerRoute = router3;

// src/modules/meal/meal.routes.ts
import { Router as Router4 } from "express";

// src/modules/meal/meal.service.ts
var createMeal = async (data, providerId) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  const result = await prisma.meal.create({
    data: {
      ...data,
      providerId
    }
  });
  return result;
};
var getAllMeals = async ({
  search,
  categoryId,
  providerId,
  dietaryPreference,
  isAvailable,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const where = {};
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: search,
          mode: "insensitive"
        }
      }
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (providerId) {
    where.providerId = providerId;
  }
  if (dietaryPreference) {
    where.dietaryType = dietaryPreference;
  }
  if (typeof isAvailable === "boolean") {
    where.isAvailable = isAvailable;
  }
  where.provider = {
    user: {
      status: "ACTIVE"
    }
  };
  const meals = await prisma.meal.findMany({
    where,
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      _count: { select: { reviews: true } },
      reviews: true
    }
  });
  const mealsWithRating = meals.map((meal) => {
    const totalReviews = meal.reviews.length;
    const averageRating = totalReviews > 0 ? meal.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews : 0;
    const { reviews, ...mealData } = meal;
    return {
      ...mealData,
      averageRating: parseFloat(averageRating.toFixed(1))
    };
  });
  const total = await prisma.meal.count({ where });
  return {
    data: mealsWithRating,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getSingleMeal = async (id) => {
  if (!id) {
    throw new AppError(400, "Meal ID is required");
  }
  const meal = await prisma.meal.findFirst({
    where: {
      id,
      provider: {
        user: {
          status: "ACTIVE"
        }
      }
    },
    include: {
      provider: {
        include: {
          user: true
        }
      }
    }
  });
  if (!meal) {
    throw new AppError(404, "Meal not found or not available");
  }
  if (meal.provider.user.status === "SUSPENDED") {
    throw new AppError(403, "This meal is not available");
  }
  return meal;
};
var mealService = {
  createMeal,
  getSingleMeal,
  getAllMeals
};

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const page = Math.max(Number(options.page) || 1, 1);
  const limit = Math.max(Number(options.limit) || 10, 1);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy ?? "createdAt";
  const sortOrder = options.sortOrder ?? "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/modules/meal/meal.controller.ts
var createMeal2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    if (req.user.role !== UserRole.PROVIDER) {
      throw new AppError(403, "Only providers can create meals");
    }
    const provider = await prisma.providerProfile.findFirst({
      where: { userId: req.user.id }
    });
    if (!provider) {
      throw new AppError(400, "Provider profile not found");
    }
    const result = await mealService.createMeal(req.body, provider.id);
    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getSingleMeal2 = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    if (!mealId) {
      throw new AppError(400, "Meal ID is required");
    }
    const result = await mealService.getSingleMeal(mealId);
    if (!result) {
      throw new AppError(404, "Meal not found");
    }
    res.status(200).json({
      success: true,
      message: "Meal fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllMeals2 = async (req, res, next) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : void 0;
    let isAvailable;
    if (typeof req.query.isAvailable === "string") {
      if (req.query.isAvailable === "true") isAvailable = true;
      if (req.query.isAvailable === "false") isAvailable = false;
    }
    const providerId = typeof req.query.providerId === "string" ? req.query.providerId : void 0;
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : void 0;
    const dietaryPreference = typeof req.query.dietaryType === "string" && Object.values(DietaryType).includes(req.query.dietaryType) ? req.query.dietaryType : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const result = await mealService.getAllMeals({
      search,
      categoryId,
      providerId,
      dietaryPreference,
      isAvailable,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json({
      success: true,
      message: "Meals fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var mealController = {
  createMeal: createMeal2,
  getSingleMeal: getSingleMeal2,
  getAllMeals: getAllMeals2
};

// src/modules/meal/meal.routes.ts
var router4 = Router4();
router4.post("/meals", authMiddleware("ADMIN" /* admin */, "PROVIDER" /* provider */), mealController.createMeal);
router4.get("/meals", mealController.getAllMeals);
router4.get("/meals/:mealId", mealController.getSingleMeal);
var mealRoute = router4;

// src/modules/review/review.routes.ts
import { Router as Router5 } from "express";

// src/modules/review/review.service.ts
var createReview = async (customerId, payload) => {
  const order = await prisma.order.findFirst({
    where: {
      id: payload.orderId,
      customerId
    },
    include: {
      items: true
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  if (order.status !== OrderStatus2.DELIVERED) {
    throw new AppError(400, "You can only review delivered orders");
  }
  const mealInOrder = order.items.find((item) => item.mealId === payload.mealId);
  if (!mealInOrder) {
    throw new AppError(400, "Meal not found in this order");
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      orderId: payload.orderId
    }
  });
  if (existingReview) {
    throw new AppError(409, "Review already submitted for this order");
  }
  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment ?? null,
      orderId: payload.orderId,
      mealId: payload.mealId,
      customerId
    }
  });
  return review;
};
var getReviewsByMeal = async (mealId) => {
  const reviews = await prisma.review.findMany({
    where: {
      mealId
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const aggregate = await prisma.review.aggregate({
    where: { mealId },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  return {
    reviews,
    stats: {
      averageRating: aggregate._avg.rating || 0,
      totalReviews: aggregate._count.rating || 0
    }
  };
};
var reviewService = {
  createReview,
  getReviewsByMeal
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    if (req.user.role !== UserRole3.CUSTOMER) {
      throw new AppError(403, "Only customers can leave reviews");
    }
    const result = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getReviewsByMeal2 = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const result = await reviewService.getReviewsByMeal(mealId);
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview: createReview2,
  getReviewsByMeal: getReviewsByMeal2
};

// src/modules/review/review.routes.ts
var router5 = Router5();
router5.get("/meal/:mealId", reviewController.getReviewsByMeal);
router5.post("/reviews", authMiddleware("CUSTOMER" /* customer */), reviewController.createReview);
var reviewRoute = router5;

// src/modules/order/order.routes.ts
import { Router as Router6 } from "express";

// src/modules/order/order.service.ts
var createOrder = async (userId, payload) => {
  if (!payload.items || payload.items.length === 0) {
    throw new AppError(400, "Order must contain at least one item");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(401, "User not found");
  }
  const meals = await prisma.meal.findMany({
    where: {
      id: { in: payload.items.map((i) => i.mealId) },
      isAvailable: true,
      provider: {
        isOpen: true,
        user: { status: "ACTIVE" }
      }
    },
    include: {
      provider: true
    }
  });
  const providerId = meals[0].providerId;
  const uniqueProviders = new Set(meals.map((m) => m.providerId));
  if (uniqueProviders.size > 1) {
    throw new AppError(400, "Meals must be from a single provider");
  }
  const orderItemsData = payload.items.map((item) => {
    const meal = meals.find((m) => m.id === item.mealId);
    return {
      mealId: meal.id,
      mealName: meal.name,
      mealPrice: meal.price,
      quantity: item.quantity
    };
  });
  const totalPrice = orderItemsData.reduce((sum, item) => sum + item.mealPrice * item.quantity, 0);
  const order = await prisma.order.create({
    data: {
      customerId: user.id,
      providerId,
      deliveryAddress: payload.deliveryAddress,
      status: OrderStatus.PLACED,
      totalPrice,
      items: {
        create: orderItemsData
      }
    },
    include: {
      items: true
    }
  });
  return order;
};
var getMyOrders = async (userId) => {
  if (!userId) {
    throw new AppError(401, "Unauthorized access");
  }
  return prisma.order.findMany({
    where: {
      customerId: userId
    },
    include: {
      items: {
        include: {
          meal: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getSingleOrder = async (userId, orderId) => {
  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId
    },
    include: {
      items: {
        include: {
          meal: true
        }
      },
      provider: true
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  return order;
};
var cancelOrder = async (customerId, orderId) => {
  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  if (order.status !== OrderStatus.PLACED) {
    throw new AppError(400, "Order cannot be cancelled at this stage");
  }
  const cancelledOrder = await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      status: OrderStatus.CANCELLED
    }
  });
  return cancelledOrder;
};
var getAllOrdersForAdmin = async () => {
  return prisma.order.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      provider: {
        select: {
          id: true,
          restaurantName: true
        }
      },
      items: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateOrderStatus3 = async (orderId, newStatus) => {
  if (!orderId) {
    throw new AppError(400, "Provider ID and Order ID are required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found or unauthorized");
  }
  if (order.status === newStatus) {
    throw new AppError(400, "Order status already updated");
  }
  const validTransitions = {
    PLACED: [OrderStatus.PREPARING],
    PREPARING: [OrderStatus.READY],
    READY: [OrderStatus.DELIVERED],
    DELIVERED: [],
    CANCELLED: []
  };
  if (!validTransitions[order.status].includes(newStatus)) {
    throw new AppError(400, "Invalid order status transition");
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });
};
var cancelOrderByAdmin = async (orderId) => {
  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }
  const cancelledOrder = await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      status: OrderStatus.CANCELLED
    }
  });
  return cancelledOrder;
};
var orderService = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrdersForAdmin,
  updateOrderStatus: updateOrderStatus3,
  cancelOrderByAdmin
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    if (req.user.role !== UserRole.CUSTOMER) {
      throw new AppError(403, "Only customers can place orders");
    }
    const result = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyOrders2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const result = await orderService.getMyOrders(req.user.id);
    res.status(201).json({
      success: true,
      message: "Orders fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getSingleOrder2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const { orderId } = req.params;
    if (!orderId) {
      throw new AppError(400, "Order ID is required");
    }
    const result = await orderService.getSingleOrder(req.user.id, orderId);
    res.status(201).json({
      success: true,
      message: "Order fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var cancelOrder2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    if (req.user.role !== UserRole.CUSTOMER) {
      throw new AppError(403, "Only customers can cancel orders");
    }
    const { orderId } = req.params;
    if (!orderId) {
      throw new AppError(400, "Order ID is required");
    }
    const result = await orderService.cancelOrder(req.user.id, orderId);
    res.status(201).json({
      success: true,
      message: "Order cancelled successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllOrdersForAdmin2 = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrdersForAdmin();
    res.status(201).json({
      success: true,
      message: "All orders fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateOrderStatus4 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const { orderId } = req.params;
    const { status: status2 } = req.body;
    if (!orderId || !status2) {
      throw new AppError(400, "Order ID and status are required");
    }
    const result = await orderService.updateOrderStatus(orderId, status2);
    res.status(201).json({
      success: true,
      message: "Order status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var cancelOrderByAdmin2 = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const { orderId } = req.params;
    if (!orderId) {
      throw new AppError(400, "Order ID is required");
    }
    const result = await orderService.cancelOrderByAdmin(orderId);
    res.status(201).json({
      success: true,
      message: "Order cancelled successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var orderController = {
  createOrder: createOrder2,
  getMyOrders: getMyOrders2,
  getSingleOrder: getSingleOrder2,
  cancelOrder: cancelOrder2,
  getAllOrdersForAdmin: getAllOrdersForAdmin2,
  updateOrderStatus: updateOrderStatus4,
  cancelOrderByAdmin: cancelOrderByAdmin2
};

// src/modules/order/order.routes.ts
var router6 = Router6();
router6.post("/orders", authMiddleware("CUSTOMER" /* customer */), orderController.createOrder);
router6.get("/orders", authMiddleware("CUSTOMER" /* customer */), orderController.getMyOrders);
router6.get("/orders/:orderId", authMiddleware("CUSTOMER" /* customer */), orderController.getSingleOrder);
router6.patch(
  "/orders/:orderId/cancel",
  authMiddleware("CUSTOMER" /* customer */),
  orderController.cancelOrder
);
router6.get("/admin/orders", authMiddleware("ADMIN" /* admin */), orderController.getAllOrdersForAdmin);
router6.patch(
  "/admin/orders/:orderId/status",
  authMiddleware("ADMIN" /* admin */),
  orderController.updateOrderStatus
);
router6.patch(
  "/admin/orders/:orderId/cancel",
  authMiddleware("ADMIN" /* admin */),
  orderController.cancelOrderByAdmin
);
var orderRoute = router6;

// src/app.ts
var app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FROTEND_URL,
  credentials: true
}));
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
app.use(globalErrorHandle_default);
app.use(notFound);
var app_default = app;

// src/server.ts
var PROT = process.env.PORT || 4e3;
async function server() {
  try {
    await prisma.$connect();
    console.log("Connected to the database sunccesfully");
    app_default.listen(PROT, () => {
      console.log(`Server running on port ${PROT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
server();
