"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSearchParams } from "next/navigation";

import { paths } from "@/paths";
import Link from "next/link";

import type { ZoneResult } from "./ZonesPageClient.types"; // Optionale Auslagerung der Typen
import { ZonesFilters } from "@/components/dashboard/zones/zones-filters";
import { ZonesPagination } from "@/components/dashboard/zones/zones-pagination";
import { ZonesSelectionProvider } from "@/components/dashboard/zones/zones-selection-context";
import { ZonesTable } from "@/components/dashboard/zones/zones-table";

interface ZonesPageClientProps {
  zonen: ZoneResult[];
}

/**
 * Client-Komponente: 
 * - Liest optional Query-Parameter (Filter)
 * - Zeigt Filterleiste, Mehrfachauswahl, Tabelle
 */
export default function ZonesPageClient({ zonen }: ZonesPageClientProps) {
  // Falls du Query-Params nutzt:
  const searchParams = useSearchParams();

  // Minimale Filter => z. B. zoneKey, name
  const zoneKey = searchParams.get("zoneKey") ?? "";
  const name = searchParams.get("name") ?? "";
  // Sorting direction
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "desc";

  // Du könntest hier Client-seitig die gefilterten Zonen berechnen.
  // Oder du implementierst serverseitig => hier Dummy-Filter
  const filtered = React.useMemo(() => {
    return zonen.filter((z) => {
      if (zoneKey && !z.zoneKey.toLowerCase().includes(zoneKey.toLowerCase())) {
        return false;
      }
      if (name && !z.zoneName.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [zonen, zoneKey, name]);

  // Sort:
  const sorted = React.useMemo(() => {
    if (sortDir === "asc") {
      return [...filtered].sort((a, b) => a.zoneName.localeCompare(b.zoneName));
    }
    // default desc
    return [...filtered].sort((a, b) => b.zoneName.localeCompare(a.zoneName));
  }, [filtered, sortDir]);

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
        {/* Überschrift + Button */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <Typography variant="h4">Zonen – Extended</Typography>
          <Button variant="contained" component={Link} href={paths.dashboard.zones.create}>
            Neue Zone anlegen!
          </Button>
        </Stack>

        {/* Selection Context + Filter + Tabelle */}
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
            {/* Pagination (minimal) */}
            <ZonesPagination count={sorted.length} page={0} />
          </Card>
        </ZonesSelectionProvider>
      </Stack>
    </Box>
  );
}
