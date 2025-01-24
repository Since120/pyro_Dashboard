import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoriesView } from "@/components/dashboard/categories/categories-view";
import type { CategoryItem } from "@/components/dashboard/categories/types";

export const metadata: Metadata = {
  title: "Categories | Dashboard",
};

// Hier eine Helper-Funktion
async function loadAllCategories(): Promise<CategoryItem[]> {
  // Prisma: Alle Category-Einträge
  // Du hast in schema: id, name, categoryType, isVisible, ...
  // In `CategoryItem` definierst du: { id, name, createdAt?, lastUsedAt? }

  const dbCats = await prisma.category.findMany();
  // => dbCats = Array<{ id: string, name: string, categoryType: string, ... }>

  // Mappen auf dein CategoryItem, z. B.:
  const catItems = dbCats.map((cat) => {
    return {
      id: cat.id,
      name: cat.name,
      // Du kannst cat.createdAt übernehmen in createdAt (Date),
      // cat.lastUsage in lastUsedAt, etc.
      createdAt: cat.createdAt ?? undefined,
      lastUsedAt: cat.lastUsage ?? null,
    } as CategoryItem;
  });

  return catItems;
}

// *** SERVER Component (async) ***
// -> Lädt echte Daten
export default async function Page() {
  const categories = await loadAllCategories();

  // categories -> an dein <CategoriesView />
  return (
    <CategoriesView categories={categories} />
  );
}
