import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function clearPayments() {
  try {
    // Check the number of existing payment records
    const count = await prisma.payment.count();

    console.log(`Found ${count} payment records.`);

    // Delete all payment records
    const result = await prisma.payment.deleteMany({});

    console.log(
      `Successfully deleted ${result.count} payment records.`
    );
  } catch (error) {
    console.error("Failed to delete payments:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

clearPayments();