// apps/dashboard/src/components/dashboard/categories/zones/zones-filters.tsx
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

import { Option } from "@/components/core/option"; // falls du so etwas hast
import { useZonesSelection } from "./zones-selection-context";

// Filter-Interfaces
export interface Filters {
  zoneKey?: string;
  name?: string;
}
export type SortDir = "asc" | "desc";

export interface ZonesFiltersProps {
  filters: Filters;   // z. B. { zoneKey, name }
  sortDir: SortDir;   // "asc" oder "desc"
}

export function ZonesFilters({ filters, sortDir }: ZonesFiltersProps) {
  const { zoneKey, name } = filters;
  const router = useRouter();
  const selection = useZonesSelection();

  // helper
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
      // dann URL updaten
      router.push(`?${searchParams.toString()}`);
        },
    [router]
  );

  // Input-Änderungen => Filter updaten
  const handleZoneKeyChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams({ ...filters, zoneKey: ev.target.value }, sortDir);
  };
  const handleNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams({ ...filters, name: ev.target.value }, sortDir);
  };

  // Sort
  const handleSortChange = (ev: SelectChangeEvent) => {
    updateSearchParams(filters, ev.target.value as SortDir);
  };

  // Clear
  const hasFilters = !!(zoneKey || name);
  const handleClear = () => {
    updateSearchParams({}, sortDir);
  };

  // Mehrfach-Löschung
  const handleDeleteSelected = React.useCallback(async () => {
    if (!window.confirm("Möchtest du alle selektierten Zonen wirklich löschen (Dummy)?")) {
      return;
    }
    alert("Hier würdest du (Dummy) die selektierten Zonen löschen.");
  }, []);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 2, flexWrap: "wrap" }}
      >
        {/* LINKS: Filter-Felder */}
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl>
            <InputLabel>Zone Key</InputLabel>
            <OutlinedInput
              sx={{ width: 160 }}
              label="Zone Key"
              value={zoneKey ?? ""}
              onChange={handleZoneKeyChange}
            />
          </FormControl>

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

        {/* RECHTS: (Selektion) + Sort */}
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

          {/* Sort */}
          <FormControl size="small">
            <InputLabel>Sort</InputLabel>
            <Select
              label="Sort"
              value={sortDir}
              onChange={handleSortChange}
              sx={{ width: 100 }}
            >
              <Option value="desc">Desc</Option>
              <Option value="asc">Asc</Option>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Divider />
    </>
  );
}
