import type * as React from "react";
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { CategoryCreateForm } from "@/components/dashboard/categories/create/category-create-form";

export const metadata = {
  title: `Create | Category | Dashboard | ${appConfig.name}`,
} satisfies Metadata;

/**
 * Page-Route für `/dashboard/categories/create`
 * Zeigt links ein (Dummy) Bild, rechts den Wizard.
 */
export default function Page(): React.JSX.Element {
  return (
    <Box sx={{ display: "flex", flex: "1 1 0", minHeight: 0 }}>
      {/* Linkes Bild (Dummy) */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: "url(/assets/people-talking.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          flex: "0 0 auto",
          display: { xs: "none", md: "block" },
          width: { md: "400px", xl: "500px" },
        }}
      />

      {/* Rechts der Wizard */}
      <Box sx={{ flex: "1 1 auto", overflowY: "auto", p: { xs: 4, sm: 6, md: 8 } }}>
        <Stack maxWidth="md" spacing={4}>
          <Typography variant="h4">Neue Kategorie Erstellen</Typography>
          <CategoryCreateForm />
        </Stack>
      </Box>
    </Box>
  );
}
