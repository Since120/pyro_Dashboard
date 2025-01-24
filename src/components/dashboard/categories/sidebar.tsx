// apps/dashboard/src/components/dashboard/categories/sidebar.tsx
"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { useMediaQuery } from "@/hooks/use-media-query";
import type { CategoryItem } from "./types";
import { SidebarList } from "./sidebar-list";
import Link from "next/link";

interface SidebarProps {
  categories: CategoryItem[];
  selectedCatId: string | null;
  onSelectCategory: (catId: string | null) => void; // <-- NEU
  open: boolean;
  onClose: () => void;
}

export function Sidebar({
  categories,
  selectedCatId,
  onSelectCategory,
  open,
  onClose,
}: SidebarProps) {
  const mdUp = useMediaQuery("up", "md");

  const content = (
    <SidebarContent
      categories={categories}
      selectedCatId={selectedCatId}
      onSelectCategory={onSelectCategory}
      onClose={onClose}
    />
  );

  if (mdUp) {
    return (
      <Box
        sx={{
          borderRight: "1px solid var(--mui-palette-divider)",
          display: { xs: "none", md: "block" },
          flex: "0 0 auto",
          width: 320,
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Drawer
      PaperProps={{ sx: { width: 320 } }}
      open={open}
      onClose={onClose}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
}

interface SidebarContentProps {
  categories: CategoryItem[];
  selectedCatId: string | null;
  onSelectCategory: (catId: string | null) => void;
  onClose: () => void;
}

function SidebarContent({
  categories,
  selectedCatId,
  onSelectCategory,
  onClose,
}: SidebarContentProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Kopf */}
      <Stack spacing={1} sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Categories</Typography>
          <IconButton onClick={onClose} sx={{ display: { md: "none" } }}>
            <XIcon />
          </IconButton>
        </Stack>
        <Button component={Link} href="/dashboard/categories/create" variant="contained" startIcon={<PlusIcon />}>
          Add Category
        </Button>
      </Stack>
      <Divider />
      {/* Liste */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <SidebarList
          categories={categories}
          selectedCatId={selectedCatId}
          onSelectCategory={onSelectCategory}
        />
      </Box>
    </Box>
  );
}
