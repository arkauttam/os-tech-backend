import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"]
});

prisma.$connect()
  .then(() => console.log("Database connected"))
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error("Database connection failed:", error.message);
    } else {
      console.error("Database connection failed:", error);
    }
    process.exit(1);
  });

export default prisma;