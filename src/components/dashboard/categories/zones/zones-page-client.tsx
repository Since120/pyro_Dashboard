"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { ZonesSelectionProvider } from "./zones-selection-context";
import { ZonesFilters } from "./zones-filters";
import { ZonesPagination } from "./zones-pagination";
import { ZonesTable } from "./zones-table";
import type { ZoneResult } from "./types";

// Falls du "paths" nutzt
import { paths } from "@/paths";

// 1) Wir entfernen Dummy-Zonen und machen realen fetch
export function ZonesPageClient() {
  const router = useRouter();
  const [zones, setZones] = React.useState<ZoneResult[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Optional: Filter-Parameter per Query (SearchParams)
  const searchParams = useSearchParams();
  const zoneKeyParam = searchParams?.get("zoneKey") ?? "";
  const nameParam = searchParams?.get("name") ?? "";
  const sortDir = (searchParams?.get("sortDir") as "asc" | "desc") ?? "desc";

  // 2) Beim Mount => Daten laden (alle Zonen)
  React.useEffect(() => {
    async function fetchZones() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/zones");
        if (!res.ok) {
          throw new Error(`Error ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        // data = Array of { id, zoneKey, zoneName, ... }
        const mapped: ZoneResult[] = data.map((z: any) => ({
          id: z.id,
          zoneKey: z.zoneKey,
          zoneName: z.zoneName,
          minutesRequired: z.minutesRequired,
          pointsGranted: z.pointsGranted,
          totalSecondsInZone: z.totalSecondsInZone ?? 0,
          lastUsage: z.lastUsage ? new Date(z.lastUsage) : null,
  
          // Neu: Falls category vorhanden => name
          categoryName: z.category ? z.category.name : null,
        }));
  
        setZones(mapped);
      } catch (err: any) {
        console.error("fetchZones error:", err);
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }
  
    fetchZones();
  }, []);

  // 3) Filtern + Sortieren (clientseitig)
  // => Du kannst es wie in der alten Dummy-Logik belassen, falls gewünscht
  const filtered = React.useMemo(() => {
    return zones.filter((z) => {
      if (zoneKeyParam && !z.zoneKey.toLowerCase().includes(zoneKeyParam.toLowerCase())) {
        return false;
      }
      if (nameParam && !z.zoneName.toLowerCase().includes(nameParam.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [zones, zoneKeyParam, nameParam]);

  const sorted = React.useMemo(() => {
    if (sortDir === "asc") {
      return [...filtered].sort((a, b) => a.zoneName.localeCompare(b.zoneName));
    }
    return [...filtered].sort((a, b) => b.zoneName.localeCompare(a.zoneName));
  }, [filtered, sortDir]);

  // 4) Neue Zone anlegen => ...
  const handleCreateZone = React.useCallback(() => {
    router.push("/dashboard/categories/zones/create");
  }, [router]);

  // 5) Render
  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", width: "100%" }}>
      <Stack spacing={4}>
        {/* Überschrift + Button */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <Typography variant="h4">Zonen Übersicht</Typography>
          <Button variant="contained" component={Link} href="/dashboard/categories/zones/create">
            Neue Zone anlegen
          </Button>
        </Stack>

        <ZonesSelectionProvider zones={sorted}>
          <Card>
            {/* Filter-Bereich */}
            <ZonesFilters
              filters={{ zoneKey: zoneKeyParam, name: nameParam }}
              sortDir={sortDir}
            />
            <Divider />

            {/* Lade-/Fehler-Zustand */}
            {loading && (
              <Typography color="text.secondary" variant="body2" sx={{ p: 2 }}>
                Loading...
              </Typography>
            )}
            {error && (
              <Typography color="error" variant="body2" sx={{ p: 2 }}>
                {error}
              </Typography>
            )}
            {!loading && !error && <ZonesTable rows={sorted} />}

            <Divider />
            <ZonesPagination count={sorted.length} page={0} />
          </Card>
        </ZonesSelectionProvider>
      </Stack>
    </Box>
  );
}
