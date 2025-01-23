// apps/dashboard/src/components/dashboard/categories/zones/zones-page-client.tsx
"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { ZonesSelectionProvider } from "./zones-selection-context";
import { ZonesFilters } from "./zones-filters";
import { ZonesPagination } from "./zones-pagination";
import { ZonesTable } from "./zones-table";
import type { ZoneResult } from "./types";

// OPTIONAL: Falls du "paths" nutzen willst
import { paths } from "@/paths"; 
// Falls du kein "paths" hast, entweder weglassen oder Dummy:
// export const paths = { dashboard: { zones: { create: "#", details: (id: string) => `#${id}` } } };

export function ZonesPageClient() {
  // 1) Dummy-Daten:
  const dummyZones: ZoneResult[] = React.useMemo(() => {
    return [
      {
        id: "zone-aaa",
        zoneKey: "Z-A01",
        zoneName: "Test Zone A",
        minutesRequired: 30,
        pointsGranted: 100,
        totalSecondsInZone: 3600 * 4, // 4 Stunden
        categoryName: "MockCat",
        lastUsage: new Date("2025-01-22T20:45:00"),
      },
      {
        id: "zone-bbb",
        zoneKey: "Z-B02",
        zoneName: "Another Zone B",
        minutesRequired: 45,
        pointsGranted: 150,
        totalSecondsInZone: 3600 * 2.5, // 2.5 Stunden
        categoryName: null,
        lastUsage: new Date("2025-01-20T15:30:00"),
      },
      {
        id: "zone-ccc",
        zoneKey: "Z-C03",
        zoneName: "Sample Zone C",
        minutesRequired: 60,
        pointsGranted: 300,
        totalSecondsInZone: 0,
        categoryName: "OtherCat",
        lastUsage: null,
      },
    ];
  }, []);

  // 2) Optional: Filter-Parameter per Query
  const searchParams = useSearchParams();
  const zoneKey = searchParams?.get("zoneKey") ?? "";
  const name = searchParams?.get("name") ?? "";
  const sortDir = (searchParams?.get("sortDir") as "asc" | "desc") ?? "desc";

  // 3) Filtern + Sortieren (clientseitig)
  const filtered = React.useMemo(() => {
    return dummyZones.filter((z) => {
      if (zoneKey && !z.zoneKey.toLowerCase().includes(zoneKey.toLowerCase())) {
        return false;
      }
      if (name && !z.zoneName.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [dummyZones, zoneKey, name]);

  const sorted = React.useMemo(() => {
    if (sortDir === "asc") {
      return [...filtered].sort((a, b) => a.zoneName.localeCompare(b.zoneName));
    }
    return [...filtered].sort((a, b) => b.zoneName.localeCompare(a.zoneName));
  }, [filtered, sortDir]);

  return (
    <Box
      sx={{
        // Ein bisschen Abstand (optional)
        maxWidth: "100%",
        mx: "auto",
        width: "100%",
      }}
    >
      <Stack spacing={4}>
        {/* Überschrift + Button */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <Typography variant="h4">Zonen Übersicht</Typography>
          <Button variant="contained" component={Link} href={paths.dashboard.zones.create}>
            Neue Zone anlegen!
          </Button>
        </Stack>

        {/* Die eigentliche Tabelle + Filter + Selektion */}
        <ZonesSelectionProvider zones={sorted}>
          <Card>
            {/* Filter-Bereich */}
            <ZonesFilters
              filters={{ zoneKey, name }}
              sortDir={sortDir}
            />
            <Divider />
            {/* Tabelle */}
            <ZonesTable rows={sorted} />
            <Divider />
            {/* Pagination (Dummy) */}
            <ZonesPagination count={sorted.length} page={0} />
          </Card>
        </ZonesSelectionProvider>
      </Stack>
    </Box>
  );
}
