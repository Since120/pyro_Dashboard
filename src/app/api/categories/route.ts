import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/categories
 * Liefert alle Kategorien aus der DB zurück.
 */
export async function GET() {
  try {
    // Prisma-Abfrage: Alle Kategorien
    const categories = await prisma.category.findMany();

    // categories ist ein Array aus { id, name, categoryType, … }
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryType, isVisible } = body; 
    // Falls du allowedRoles, etc. aus der UI sendest => destructure das auch

    if (!name || !categoryType) {
      return NextResponse.json({ error: "Name & categoryType required" }, { status: 400 });
    }

    const newCat = await prisma.category.create({
      data: {
        name,
        categoryType,
        isVisible: isVisible ?? true,
        // Falls du allowedRoles[] etc. hast => data: { allowedRoles: ... }
      },
    });

    return NextResponse.json(newCat, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}