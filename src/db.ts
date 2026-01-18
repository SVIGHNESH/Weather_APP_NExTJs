import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance to be shared across the application
// Prisma v7 requires at least an empty object to be passed
export const prisma = new PrismaClient({});

// Handle cleanup on application shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
