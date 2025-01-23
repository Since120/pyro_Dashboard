"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Option } from "@/components/core/option";
import { useZonesSelection } from "./zones-selection-context";

// Dein Filter-Interface
export interface Filters {
  zoneKey?: string;
  name?: string;
}
// Sortier-Richtung
export type SortDir = "asc" | "desc";

// Props der Component
export interface ZonesFiltersProps {
  filters: Filters;        // { zoneKey, name }
  sortDir: SortDir;        // "asc" | "desc"
}

export function ZonesFilters({ filters, sortDir }: ZonesFiltersProps): React.JSX.Element {
  const { zoneKey, name } = filters;

  const router = useRouter();
  const selection = useZonesSelection();

  // Hilfs-Funktion für Query-Params
  const updateSearchParams = React.useCallback(
    (newFilters: Filters, newSortDir: SortDir) => {
      const searchParams = new URLSearchParams();

      if (newFilters.zoneKey) {
        searchParams.set("zoneKey", newFilters.zoneKey);
      }
      if (newFilters.name) {
        searchParams.set("name", newFilters.name);
      }
      if (newSortDir === "asc") {
        searchParams.set("sortDir", "asc");
      }
      // → Du kannst beliebig mehr Param verschicken

      router.push(`?${searchParams.toString()}`);
    },
    [router]
  );

  // Filter-Änderungen
  const handleZoneKeyChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams({ ...filters, zoneKey: ev.target.value }, sortDir);
  };
  const handleNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams({ ...filters, name: ev.target.value }, sortDir);
  };

  // Sort ändern
  const handleSortChange = (ev: SelectChangeEvent) => {
    updateSearchParams(filters, ev.target.value as SortDir);
  };

  // Clear Filters
  const handleClear = () => {
    updateSearchParams({}, sortDir);
  };

  // Hat man überhaupt Filter in use?
  const hasFilters = !!(zoneKey || name);

  // =========================================
  //    DELETE-Handler (Mehrfach-Löschung)
  // =========================================
  const handleDeleteSelected = React.useCallback(async () => {
    if (!window.confirm("Möchtest du alle selektierten Zonen wirklich löschen?")) {
      return;
    }

    try {
      // Schleife über alle selektierten IDs
      for (const zoneId of selection.selected) {
        const response = await fetch(`/api/zones/${zoneId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          throw new Error(err?.error || response.statusText);
        }
      }

      //alert("Alle selektierten Zonen wurden gelöscht.");
      router.refresh()
      router.refresh(); 
      // oder: router.push("/dashboard/zones");
    } catch (error) {
      console.error("handleDeleteSelected error:", error);
      alert("Fehler beim Löschen: " + String(error));
    }
  }, [selection.selected, router]);

  return (
    <React.Fragment>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2, flexWrap: "wrap" }}
      >
        {/* 
          LINKS: Filter-Felder, Clear 
        */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Filter: zoneKey */}
          <FormControl>
            <InputLabel>Zone Key</InputLabel>
            <OutlinedInput
              sx={{ width: 160 }}
              label="Zone Key"
              value={zoneKey ?? ""}
              onChange={handleZoneKeyChange}
            />
          </FormControl>

          {/* Filter: name */}
          <FormControl>
            <InputLabel>Name</InputLabel>
            <OutlinedInput
              sx={{ width: 160 }}
              label="Name"
              value={name ?? ""}
              onChange={handleNameChange}
            />
          </FormControl>

          {hasFilters && (
            <Button onClick={handleClear}>Clear filters</Button>
          )}
        </Stack>

        {/* 
          RECHTS: (wenn Selection) => "X selected => Delete" + Sort
        */}
        <Stack direction="row" spacing={2} alignItems="flex-end">
          {selection.selectedAny && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography color="text.secondary" variant="body2">
                {selection.selected.size} selected
              </Typography>
              <Button
                color="error"
                variant="contained"
                onClick={handleDeleteSelected}
              >
                Delete
              </Button>
            </Stack>
          )}

          {/* Sort-Select */}
          <FormControl size="small">
            <InputLabel>Sort</InputLabel>
            <Select label="Sort" value={sortDir} onChange={handleSortChange} sx={{ width: 100 }}>
              <Option value="desc">Desc</Option>
              <Option value="asc">Asc</Option>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Divider />
    </React.Fragment>
  );
}
