// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("gggggggg", 10);

  console.log("🌱 Seeding database...");

  // --- Step 1: Create user ---
  const user = await prisma.user.upsert({
    where: { email: "momen@gmail.com" },
    update: {
      name: "Momen",
      emailVerified: new Date(),
    },
    create: {
      name: "Momen",
      email: "momen@gmail.com",
      emailVerified: new Date(),
      password: hashed,
      avatar: "https://ui-avatars.com/api/?name=Momen",
      themeColor: "#4f46e5",
    },
  });

  // --- Step 2: Create workspace ---
  const workspace = await prisma.workspace.upsert({
    where: { name: "Momen's Workspace" , id: '1'},
    update: {},
    create: {
      name: "Momen's Workspace",
      description: "Default workspace for Momen",
      hasCompletedOnboarding: true,
    },
  });

  // --- Step 3: Link user and workspace (membership) ---
  await prisma.membership.upsert({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      workspaceId: workspace.id,
      role: "OWNER",
    },
  });

  console.log(`✅ Seed completed!`);
  console.log(`User: ${user.email}`);
  console.log(`Workspace: ${workspace.name}`);
}

main()
  .catch((err) => {
    console.error("❌ Error while seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
