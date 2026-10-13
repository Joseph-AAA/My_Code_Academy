import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";  //connect Prisma to PostgreSQL
import { PrismaClient } from "@prisma/client";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({           
  adapter,
});

export default prisma;