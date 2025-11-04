// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("gggggggg", 10);

  // --- Step 1: Create or update main user ---
  const user = await prisma.user.upsert({
    where: { email: "momen@gmail.com" },
    update: {
      name: "Momen",
      emailVerified: new Date(),
      lastLogin: new Date(),
    },
    create: {
      name: "Momen",
      email: "momen@gmail.com",
      emailVerified: new Date(),
      password: passwordHash,
      avatar: "https://ui-avatars.com/api/?name=Momen",
      themeColor: "#4f46e5",
      lastLogin: new Date(),
    },
  });

  // --- Step 2: Create workspace ---
  const workspace = await prisma.workspace.create({
    data: {
      name: "Momen’s Workspace",
      slug: "momen-workspace",
      description: "Default workspace for Momen",
      hasCompletedOnboarding: true,
      createdBy: {
        connect: { id: user.id },
      },
      memberships: {
        create: {
          userId: user.id,
          role: Role.OWNER,
        },
      },
      activityLog: {
        create: {
          userId: user.id,
          entityType: "Workspace",
          entityId: "init",
          action: "CREATE",
          metadata: { note: "Workspace created during seed" },
        },
      },
    },
  });

  // --- Step 3: Create default project ---
  const project = await prisma.project.create({
    data: {
      name: "Welcome Project",
      description: "Sample project to get started with Planora",
      workspace: { connect: { id: workspace.id } },
      createdBy: { connect: { id: user.id } },
      visibility: "PRIVATE",
    },
  });

  // --- Step 4: Create default task ---
  const task = await prisma.task.create({
    data: {
      title: "Getting Started",
      description: "This is your first task! 🎉",
      status: "TODO",
      priority: "MEDIUM",
      project: { connect: { id: project.id } },
      assignee: { connect: { id: user.id } },
    },
  });

  // --- Step 5: Add an activity log for the project ---
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
      entityType: "Project",
      entityId: project.id,
      action: "CREATE",
      metadata: { note: "Default project created during seeding" },
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log(`👤 User: ${user.email}`);
  console.log(`🏢 Workspace: ${workspace.name}`);
  console.log(`📁 Project: ${project.name}`);
  console.log(`✅ Task: ${task.title}`);
}

main()
  .catch((err) => {
    console.error("❌ Error while seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
