import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const keepEmails = [
  "testuser01@example.com",
  "test@gmail.com",
  "test+user@qworky.tech",
  "unlockpassw23@gmail.com",
  "jj.joseph.aaa@gmail.com",
];

async function clearOtherStudents() {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    // Find student accounts that are not on the keep list.
    const studentsToDelete = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        email: {
          notIn: keepEmails,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    console.log("\nStudent accounts to be deleted:");

    if (studentsToDelete.length === 0) {
      console.log("No other student accounts found.");
      return;
    }

    studentsToDelete.forEach((student, index) => {
      console.log(
        `${index + 1}. ${student.name} - ${student.email}`
      );
    });

    console.log(`\nTotal accounts to delete: ${studentsToDelete.length}`);

    const confirmation = await rl.question(
      '\nType DELETE to permanently delete these accounts: '
    );

    if (confirmation !== "DELETE") {
      console.log("\nDeletion cancelled. No accounts were deleted.");
      return;
    }

    // Delete only the listed student accounts.
    const result = await prisma.user.deleteMany({
      where: {
        role: "STUDENT",
        email: {
          notIn: keepEmails,
        },
      },
    });

    console.log(
      `\nSuccessfully deleted ${result.count} student accounts.`
    );

    console.log("Your five selected student accounts and all admins are preserved.");
  } catch (error) {
    console.error("Failed to clean student accounts:", error);
    process.exitCode = 1;
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

clearOtherStudents();