import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/categories/[categoryId]
export async function PATCH(
  request: Request,
  context: { params: { categoryId: string } }
) {
  try {
    const catId = context.params.categoryId;
    const body = await request.json();
    // body = { name?, categoryType?, isVisible?, allowedRoles? ... }

    if (!catId) {
      return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
    }

    // Gewünschte Felder extrahieren:
    const { name, categoryType, isVisible, allowedRoles } = body;

    const updatedCat = await prisma.category.update({
      where: { id: catId },
      data: {
        ...(name !== undefined && { name }),
        ...(categoryType !== undefined && { categoryType }),
        ...(isVisible !== undefined && { isVisible }),
        ...(allowedRoles !== undefined && { allowedRoles }),
      },
    });

    return NextResponse.json(updatedCat, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/categories/[categoryId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// DELETE /api/categories/[categoryId]
export async function DELETE(
  request: Request,
  context: { params: { categoryId: string } }
) {
  try {
    const catId = context.params.categoryId;
    if (!catId) {
      return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
    }

    const deletedCat = await prisma.category.delete({
      where: { id: catId },
    });

    return NextResponse.json(deletedCat, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/categories/[categoryId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
