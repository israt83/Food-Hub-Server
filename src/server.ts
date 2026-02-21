import app from "./app";
import { prisma } from "./lib/prisma";

const PROT = process.env.PORT || 4000;

async function server() {
  try {
    await prisma.$connect();
    console.log('Connected to the database sunccesfully')
    app.listen(PROT, () => {
      console.log(`Server running on port ${PROT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

server();
