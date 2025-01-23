import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1) JSON aus dem Request lesen
    const body = await request.json();
    const { zoneKey, zoneName, minutesRequired, pointsGranted } = body;

    // 2) Validierung (minimal)
    if (!zoneKey || !zoneName) {
      return NextResponse.json(
        { error: "zoneKey and zoneName are required" },
        { status: 400 }
      );
    }

    // 3) DB-Insert
    const newZone = await prisma.zone.create({
      data: {
        zoneKey,
        zoneName,
        minutesRequired: minutesRequired ?? 60,
        pointsGranted: pointsGranted ?? 1,
      },
    });

    // 4) Erfolg: JSON zurück
    return NextResponse.json(newZone, { status: 201 });
  } catch (error) {
    console.error("POST /api/zones error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
