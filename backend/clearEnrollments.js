import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function clearEnrollments() {
  try {
    // Check the number of existing enrollment records
    const count = await prisma.enrollment.count();

    console.log(`Found ${count} enrollment records.`);

    // Delete all enrollment records
    const result = await prisma.enrollment.deleteMany({});

    console.log(
      `Successfully deleted ${result.count} enrollment records.`
    );
  } catch (error) {
    console.error("Failed to delete enrollments:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

clearEnrollments();