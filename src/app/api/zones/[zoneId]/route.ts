export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0; // optional

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/zones/[zoneId]
export async function PATCH(
  request: Request,
  context: { params: { zoneId: string } }
) {
  try {
    const { zoneId } = context.params;
    const body = await request.json();
    const { zoneKey, zoneName, minutesRequired, pointsGranted } = body;

    const dataToUpdate: any = {};
    if (typeof zoneKey === "string") {
      dataToUpdate.zoneKey = zoneKey;
    }
    if (typeof zoneName === "string") {
      dataToUpdate.zoneName = zoneName;
    }
    if (typeof minutesRequired === "number") {
      dataToUpdate.minutesRequired = minutesRequired;
    }
    if (typeof pointsGranted === "number") {
      dataToUpdate.pointsGranted = pointsGranted;
    }

    const updated = await prisma.zone.update({
      where: { id: zoneId },
      data: dataToUpdate,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /zones/[zoneId] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/zones/[zoneId]
export async function DELETE(
  request: Request,
  context: { params: { zoneId: string } }
) {
  try {
    const { zoneId } = context.params;

    const deleted = await prisma.zone.delete({
      where: { id: zoneId },
    });

    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("DELETE /zones/[zoneId] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
