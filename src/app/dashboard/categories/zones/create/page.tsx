// apps/dashboard/src/app/dashboard/categories/zones/create/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { appConfig } from "@/config/app";
import { ZoneCreateForm } from "@/components/dashboard/categories/zones/zone-create-form";

// Optional: Falls du ein Pfad-Objekt hast
// import { paths } from "@/paths";

export const metadata: Metadata = {
  title: `Create | Zones | Dashboard | ${appConfig.name}`,
};

export default function Page() {
  return (
    <Box
      sx={{
        // EXAKT wie dein originales Layout:
        maxWidth: "var(--Content-maxWidth)",
        m: "var(--Content-margin)",
        p: "var(--Content-padding)",
        width: "var(--Content-width)",
      }}
    >
      <Stack spacing={4}>
        {/* Kopfzeile */}
        <Stack spacing={3}>
          <div>
            <Button
              component={Link}
              href="/dashboard/categories"
              startIcon={<ArrowLeftIcon />}
              color="inherit"
              sx={{ gap: 1 }}
            >
              Zones
            </Button>
          </div>
          <div>
            <Typography variant="h4">Zone Erstellen</Typography>
          </div>
        </Stack>

        {/* Client-Form */}
        <ZoneCreateForm />
      </Stack>
    </Box>
  );
}
