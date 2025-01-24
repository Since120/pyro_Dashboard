export const runtime = "nodejs";  // <-- Wichtig!

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pfad anpassen

// PATCH /api/zones/[zoneId]
export async function PATCH(request: Request, context: { params: { zoneId: string } }) {
  try {
    const zoneId = context.params.zoneId;
    const body = await request.json();
    console.log("PATCH /api/zones ->", zoneId, body);

    const { zoneKey, zoneName, minutesRequired, pointsGranted, categoryId } = body;

    if (!zoneId) {
      return NextResponse.json({ error: "Missing zoneId" }, { status: 400 });
    }

    // Prisma-Update
    const updated = await prisma.zone.update({
      where: { id: zoneId },
      data: {
        ...(zoneKey !== undefined && { zoneKey }),
        ...(zoneName !== undefined && { zoneName }),
        ...(minutesRequired !== undefined && { minutesRequired }),
        ...(pointsGranted !== undefined && { pointsGranted }),
        ...(categoryId !== undefined && {
          categoryId: categoryId === "" ? null : categoryId,
        }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("PATCH /api/zones/[zoneId] error:", err?.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/zones/[zoneId]
export async function DELETE(request: Request, context: { params: { zoneId: string } }) {
  try {
    const zoneId = context.params.zoneId;
    if (!zoneId) {
      return NextResponse.json({ error: "Missing zoneId" }, { status: 400 });
    }

    const deleted = await prisma.zone.delete({
      where: { id: zoneId },
    });

    return NextResponse.json(deleted, { status: 200 });
  } catch (err: any) {
    console.error("DELETE /api/zones/[zoneId] error:", err?.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
