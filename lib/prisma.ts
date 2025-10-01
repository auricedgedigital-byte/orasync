import { PrismaClient } from "@prisma/client";

declare global {
  // ensure the prisma client is shared across hot-reloads in development
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: ["query"]
  });

if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

export default prisma;
