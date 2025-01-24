// apps/dashboard/src/components/dashboard/categories/zones/zone-edit-form.tsx
"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";

interface ZoneData {
  id: string;
  zoneKey: string;
  zoneName: string;
  minutesRequired: number;
  pointsGranted: number;
  // Ganz wichtig: categoryId => zum Vor-Auswählen
  categoryId?: string | null;
}

interface CategoryOption {
  id: string;
  name: string;
}

export function ZoneEditForm({ zone }: { zone: ZoneData }) {
  const router = useRouter();

  // 1) Kategorien laden
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  // => categoryId: initialer Wert => zone.categoryId ?? ""
  const [categoryId, setCategoryId] = useState(zone.categoryId ?? "");

  // 2) Restliche States
  const [zoneKey, setZoneKey] = useState(zone.zoneKey);
  const [zoneName, setZoneName] = useState(zone.zoneName);
  const [minutesRequired, setMinutesRequired] = useState(zone.minutesRequired);
  const [pointsGranted, setPointsGranted] = useState(zone.pointsGranted);

  // 3) useEffect => Lade Category-Liste
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          throw new Error(`Error ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
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

  // 4) Speichern => PATCH /api/zones/[zone.id]
  const handleSave = useCallback(async () => {
    try {
      const payload = {
        zoneKey,
        zoneName,
        minutesRequired,
        pointsGranted,
        categoryId,
      };

      const res = await fetch(`/api/zones/${zone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`Fehler beim Update: ${errData.error ?? res.statusText}`);
        return;
      }

      const updatedZone = await res.json();
      alert(`Zone aktualisiert. Key=${updatedZone.zoneKey}`);
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("handleSave error:", error);
      alert("Unerwarteter Fehler beim Update: " + String(error));
    }
  }, [
    zone.id,
    zoneKey,
    zoneName,
    minutesRequired,
    pointsGranted,
    categoryId,
    router,
  ]);

  // 5) Löschen => DELETE /api/zones/[zone.id]
  const handleDelete = useCallback(async () => {
    const confirmed = window.confirm("Wirklich löschen?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/zones/${zone.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`Fehler beim Löschen: ${errData.error ?? res.statusText}`);
        return;
      }

      router.push("/dashboard/categories");
    } catch (error) {
      console.error("handleDelete error:", error);
      alert("Unerwarteter Fehler beim Löschen: " + String(error));
    }
  }, [zone.id, router]);

  return (
    <Stack spacing={2}>
      {/* Neues Dropdown: Kategorie */}
      <TextField
        select
        label="Kategorie"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        helperText="Wähle die Kategorie, in der diese Zone liegt"
      >
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

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button color="error" variant="outlined" sx={{ flex: 1 }} onClick={handleDelete}>
          Löschen
        </Button>
        <Button variant="contained" sx={{ flex: 3 }} onClick={handleSave}>
          Änderungen Speichern
        </Button>
      </Stack>
    </Stack>
  );
}
