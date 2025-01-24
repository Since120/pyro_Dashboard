export const runtime = "nodejs";  // <-- Wichtig!

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Passe den Pfad an dein Projekt an

// GET /api/zones
export async function GET() {
  try {
    // Hole alle Zonen + verknüpfte Kategorie
    const zones = await prisma.zone.findMany({
      include: {
        category: true, // => category: { id, name, ... }
      },
    });
    return NextResponse.json(zones, { status: 200 });
  } catch (error) {
    console.error("GET /api/zones error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// NEU: POST /api/zones
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // body z. B. { zoneKey, zoneName, minutesRequired, pointsGranted, categoryId }

    const { zoneKey, zoneName, minutesRequired, pointsGranted, categoryId } = body;

    // 1) Minimale Validierung
    if (!zoneKey || !zoneName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2) Prisma create
    const newZone = await prisma.zone.create({
      data: {
        zoneKey,
        zoneName,
        minutesRequired: minutesRequired ?? 60,
        pointsGranted: pointsGranted ?? 1,
        categoryId: categoryId || null,  // <- Falls "" => null
      },
    });

    return NextResponse.json(newZone, { status: 201 });
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : String(err);
    console.error("POST /api/zones error:", msg);

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
