"use client";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { NotePencil as NotePencilIcon } from "@phosphor-icons/react/dist/ssr/NotePencil";

import type { ZoneResult } from "app/dashboard/zones/ZonesPageClient.types";
import { DataTable } from "@/components/core/data-table";
import type { ColumnDef } from "@/components/core/data-table";
import { useZonesSelection } from "./zones-selection-context";
import { paths } from "@/paths";
import Link from "next/link";

// 1) Columns definieren
const columns: ColumnDef<ZoneResult>[] = [
  {
    field: "zoneKey",
    name: "Zonen Key",
    width: "150px",
  },
  {
    field: "zoneName",
    name: "Zonen Name",
    width: "150px",
  },
  {
    formatter: (row) => String(row.minutesRequired),
    name: "Minuten",
    width: "120px",
  },
  {
    formatter: (row) => String(row.pointsGranted),
    name: "Punkte",
    width: "100px",
  },
  {
    formatter: (row) => {
      const hours = Math.floor(row.totalSecondsInZone / 3600);
      const minutes = Math.floor((row.totalSecondsInZone % 3600) / 60);
      return `${hours}h ${minutes}m`;
    },
    name: "Gesamtzeit",
    width: "120px",
  },
  {
    formatter: (row) => row.categoryName ?? "-",
    name: "Kategorie",
    width: "120px",
  },
  {
    formatter: (row) => {
      if (!row.lastUsage) return "-";
      return new Date(row.lastUsage).toLocaleString();
    },
    name: "Zuletzt benutzt",
    width: "180px",
  },
  {
    formatter: (row) => (
      <IconButton component={Link} href={paths.dashboard.zones.details(row.id)}>
        <NotePencilIcon />
      </IconButton>
    ),
    name: "Edit",
    hideName: true,
    width: "80px",
    align: "right",
  },
];

// 2) Props
export interface ZonesTableProps {
  rows: ZoneResult[];
}

// 3) Komponente
export function ZonesTable({ rows }: ZonesTableProps): React.JSX.Element {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useZonesSelection();

  return (
    <>
      <DataTable<ZoneResult>
        columns={columns}
        rows={rows}
        selectable
        selected={selected}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onSelectOne={(_, row) => selectOne(row.id)}
        onDeselectOne={(_, row) => deselectOne(row.id)}
      />
      {rows.length === 0 && (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
            No zones found
          </Typography>
        </Box>
      )}
    </>
  );
}
