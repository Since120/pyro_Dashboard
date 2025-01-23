export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0; // optional

import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";

import { prisma } from "@/lib/prisma";
import { appConfig } from "@/config/app";
import { ZoneEditForm } from "@/components/dashboard/zones/zone-edit-form";

export const metadata: Metadata = {
  title: "Zone bearbeiten",
};

// SSR-Fetch
async function fetchZoneFromDB(zoneId: string) {
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
            <Link
              color="text.primary"
              component={RouterLink}
              href="/dashboard/zones"
              sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              Zonen
            </Link>
          </div>
          <div>
            <Typography variant="h4">Zone bearbeiten</Typography>
          </div>
        </Stack>

        {/* Client-Form: Edit */}
        <ZoneEditForm
          zone={{
            id: zone.id,
            zoneKey: zone.zoneKey,
            zoneName: zone.zoneName,
            minutesRequired: zone.minutesRequired,
            pointsGranted: zone.pointsGranted,
          }}
        />
      </Stack>
    </Box>
  );
}
