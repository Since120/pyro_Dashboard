// apps/dashboard/src/components/dashboard/categories/categories-view.tsx
"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr/DotsThree";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";

import { Sidebar } from "./sidebar";
import type { CategoryItem } from "./types";

// NEU: importiere deine “Zonen”-Komponente
import { ZonesPageClient } from "./zones/zones-page-client"; 

export interface CategoriesViewProps {
  categories: CategoryItem[];
}

export function CategoriesView({ categories }: CategoriesViewProps) {
  const [openSidebar, setOpenSidebar] = React.useState<boolean>(false);
  const [selectedCatId, setSelectedCatId] = React.useState<string | null>(null);

  // Drawer
  const handleSidebarOpen = React.useCallback(() => {
    setOpenSidebar(true);
  }, []);
  const handleSidebarClose = React.useCallback(() => {
    setOpenSidebar(false);
  }, []);

  // Klick auf Kategorie => Toggle
  const handleCategorySelect = React.useCallback((catId: string | null) => {
    setSelectedCatId(catId);
  }, []);

  return (
    <Box sx={{ display: "flex", flex: "1 1 0", minHeight: 0 }}>
      {/* Linke Sidebar */}
      <Sidebar
        categories={categories}
        selectedCatId={selectedCatId}
        onSelectCategory={handleCategorySelect}
        open={openSidebar}
        onClose={handleSidebarClose}
      />

      {/* Hauptbereich rechts */}
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Kopfzeile */}
        <Box
          sx={{
            borderBottom: "1px solid var(--mui-palette-divider)",
            display: "flex",
            flex: "0 0 auto",
            p: 2,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ flex: "1 1 auto" }}>
            <IconButton onClick={handleSidebarOpen} sx={{ display: { md: "none" } }}>
              <ListIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton>
              <DotsThreeIcon weight="bold" />
            </IconButton>
          </Stack>
        </Box>

        {/* NEU: Hier kommt die "Zonen"-Tabelle */}
        <Box sx={{ flex: "1 1 auto", p: 3 }}>
          <ZonesPageClient />
        </Box>
      </Box>
    </Box>
  );
}
