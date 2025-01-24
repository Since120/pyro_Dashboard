import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { prisma } from "@/lib/prisma"; // PFAD anpassen
import { CategoryEditForm } from "@/components/dashboard/categories/category-edit-form";

export const metadata: Metadata = {
  title: "Kategorie bearbeiten",
};

async function fetchCategoryFromDB(categoryId: string) {
  const cat = await prisma.category.findUnique({ where: { id: categoryId } });
  return cat; // oder null
}

interface PageProps {
  params: { categoryId: string };
}

// Server-Component
export default async function Page({ params }: PageProps) {
  const { categoryId } = params;

  // Hol echte Daten
  const category = await fetchCategoryFromDB(categoryId);
  if (!category) {
    notFound(); // zeigt 404
  }

  // CategoryEditForm braucht: { id, name, categoryType, tags: string[], isVisible: boolean }
  // In DB hast du "allowedRoles", wir mappen es auf "tags"
  return (
    <Box
      sx={{
        maxWidth: "var(--Content-maxWidth)",
        m: "var(--Content-margin)",
        p: "var(--Content-padding)",
        width: "var(--Content-width)",
      }}
    >
      <Stack spacing={4}>
        <Stack spacing={3}>
          <div>
            <Button
              component={Link}
              href="/dashboard/categories"
              startIcon={<ArrowLeftIcon />}
              color="inherit"
              sx={{ gap: 1 }}
            >
              Kategorien
            </Button>
          </div>
          <div>
            <Typography variant="h4">Kategorie bearbeiten</Typography>
          </div>
        </Stack>

        {/* Client-Form: Edit */}
        <CategoryEditForm
          category={{
            id: category.id,
            name: category.name,
            categoryType: category.categoryType,
            tags: category.allowedRoles ?? [],
            isVisible: category.isVisible,
          }}
        />
      </Stack>
    </Box>
  );
}
