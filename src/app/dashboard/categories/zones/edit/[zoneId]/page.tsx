// apps/dashboard/src/app/dashboard/categories/zones/edit/[zoneId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { prisma } from "@/lib/prisma"; // anpassen, wo du Prisma importierst
import { ZoneEditForm } from "@/components/dashboard/categories/zones/zone-edit-form";

export const metadata: Metadata = {
  title: "Zone bearbeiten",
};

// SSR-Fetch einer Zone + categoryId etc.
async function fetchZoneFromDB(zoneId: string) {
  // Optional: Du könntest include: { category: true } machen
  // Wir brauchen aber nur categoryId (reicht "findUnique"?), also:
  const zone = await prisma.zone.findUnique({
    where: { id: zoneId },
  });
  return zone;
}

interface PageProps {
  params: { zoneId: string };
}

export default async function Page({ params }: PageProps) {
  const { zoneId } = params;
  const zone = await fetchZoneFromDB(zoneId);

  if (!zone) {
    notFound();
  }

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
              Zonen
            </Button>
          </div>
          <div>
            <Typography variant="h4">Zone bearbeiten</Typography>
          </div>
        </Stack>

        {/* Client-Form => mit categoryId */}
        <ZoneEditForm
          zone={{
            id: zone.id,
            zoneKey: zone.zoneKey,
            zoneName: zone.zoneName,
            minutesRequired: zone.minutesRequired,
            pointsGranted: zone.pointsGranted,
            // WICHTIG: hier übergeben wir zone.categoryId
            categoryId: zone.categoryId, 
          }}
        />
      </Stack>
    </Box>
  );
}
