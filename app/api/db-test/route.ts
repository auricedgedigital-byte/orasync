// app/api/db-test/route.ts
import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";

declare global {
  // Reuse a single PrismaClient in serverless environments.
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = global.__prisma ?? (global.__prisma = new PrismaClient());

export async function GET(req: NextRequest) {
  try {
    // Lightweight test query
    const res = await prisma.$queryRaw`SELECT 1 as ok`;
    return new Response(JSON.stringify({ ok: true, result: res }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    const message = err?.message ?? String(err);
    return new Response(
      JSON.stringify({
        ok: false,
        message,
        stack: err?.stack?.toString?.(),
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
