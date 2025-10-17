// app/api/patients/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(patients);
  } catch (err) {
    console.error("GET /api/patients error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, practiceId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    // NOTE: practiceId optional — adapt to your app logic
    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        practiceId: practiceId ?? "", // set a default or require it depending on your model
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (err) {
    console.error("POST /api/patients error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
