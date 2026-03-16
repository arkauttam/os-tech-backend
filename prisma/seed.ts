import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

  const email = "admin@example.com";

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: email,
      contact: "9999999999",
      password: password,
      type: "ADMIN"
    }
  });

  console.log("Admin created successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());