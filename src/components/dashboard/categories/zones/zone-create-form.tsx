// apps/dashboard/src/components/dashboard/categories/zones/zone-create-form.tsx
"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem"; // <-- Für das Select
import { useRouter } from "next/navigation";

interface CategoryOption {
  id: string;
  name: string;
}

export function ZoneCreateForm() {
  const router = useRouter();

  // 1) Kategorieliste laden (id + name)
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState("");

  // 2) Restliche States
  const [zoneKey, setZoneKey] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [minutesRequired, setMinutesRequired] = useState<number>(60);
  const [pointsGranted, setPointsGranted] = useState<number>(1);

  // 3) Effekt: Kategorien aus /api/categories laden
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          throw new Error(`Error ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        // data = Array of { id, name, ... }
        // Du kannst mehr Felder rausfiltern, wir nehmen nur id + name
        const mapped = data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
        }));
        setCategories(mapped);
      } catch (err) {
        console.error("loadCategories error:", err);
      }
    }
    loadCategories();
  }, []);

  // 4) Handle Save
  const handleSave = useCallback(async () => {
    try {
      // 1) Payload
      const payload = {
        zoneKey,
        zoneName,
        minutesRequired,
        pointsGranted,
        categoryId, // <-- Neu, damit Prisma weiß, wohin die Zone gehört
      };

      // 2) POST /api/zones
      const response = await fetch("/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // z.B. 400 BadRequest (Missing fields) oder 500
        const errData = await response.json();
        alert(`Fehler beim Erstellen: ${errData.error ?? response.statusText}`);
        return;
      }

      // 3) Erfolg => neue Zone in DB
      const createdZone = await response.json();
      alert(`Zone wurde angelegt (ID=${createdZone.id}).`);
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("handleSave error:", error);
      alert(`Unerwarteter Fehler: ${String(error)}`);
    }
  }, [zoneKey, zoneName, minutesRequired, pointsGranted, categoryId, router]);

  // 5) Render
  return (
    <Stack spacing={2}>
      {/* Neues Feld: Kategorie-Dropdown */}
      <TextField
        select
        label="Kategorie"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        helperText="Wähle eine Kategorie, zu der die Zone gehört"
      >
        {/* Option für "Keine Kategorie"? => optional */}
        <MenuItem value="">
          <em>Keine Kategorie</em>
        </MenuItem>

        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Zone Key"
        value={zoneKey}
        onChange={(e) => setZoneKey(e.target.value)}
      />
      <TextField
        label="Zone Name"
        value={zoneName}
        onChange={(e) => setZoneName(e.target.value)}
      />
      <TextField
        label="Benötigte Minuten"
        type="number"
        value={minutesRequired}
        onChange={(e) => setMinutesRequired(Number(e.target.value))}
      />
      <TextField
        label="Punkte"
        type="number"
        value={pointsGranted}
        onChange={(e) => setPointsGranted(Number(e.target.value))}
      />

      <Button variant="contained" onClick={handleSave}>
        Speichern
      </Button>
    </Stack>
  );
}
