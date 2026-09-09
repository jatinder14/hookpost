#!/usr/bin/env node
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/make-superadmin.js <user_email>");
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase() },
    include: { organizations: true }
  });

  if (!user) {
    console.error(`Error: User with email "${email}" not found in database.`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isSuperAdmin: true }
  });

  if (user.organizations.length > 0) {
    const orgId = user.organizations[0].organizationId;
    await prisma.subscription.upsert({
      where: { organizationId: orgId },
      create: {
        organizationId: orgId,
        identifier: "sub_admin_lifetime",
        period: "YEARLY",
        totalChannels: 100,
        subscriptionTier: "TEAM",
        isLifetime: true,
      },
      update: {
        subscriptionTier: "TEAM",
        totalChannels: 100,
        isLifetime: true,
        deletedAt: null
      }
    });
  }

  console.log(`✅ Successfully made "${email}" a SuperAdmin with Lifetime Team Access (100 channels)!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
