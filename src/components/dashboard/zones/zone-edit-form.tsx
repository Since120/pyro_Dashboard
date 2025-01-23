"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { TextField, Stack, Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface ZoneData {
  id: string;
  zoneKey: string;
  zoneName: string;
  minutesRequired: number;
  pointsGranted: number;
}

export function ZoneEditForm({ zone }: { zone: ZoneData }) {
  const router = useRouter();

  const [zoneKey, setZoneKey] = useState(zone.zoneKey);
  const [zoneName, setZoneName] = useState(zone.zoneName);
  const [minutesRequired, setMinutesRequired] = useState(zone.minutesRequired);
  const [pointsGranted, setPointsGranted] = useState(zone.pointsGranted);

  // -- PATCH
  const handleSave = useCallback(async () => {
    try {
      const payload = {
        zoneKey,
        zoneName,
        minutesRequired,
        pointsGranted,
      };

      const response = await fetch(`/api/zones/${zone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(
          `Fehler beim Update: ${errData.error ?? response.statusText}`
        );
        return;
      }

      // Erfolg
      alert("Zone wurde aktualisiert!");
      // Optional: zurück zur Liste
      router.push("/dashboard/zones");
    } catch (error) {
      console.error("handleSave error:", error);
      alert("Unerwarteter Fehler beim Update: " + String(error));
    }
  }, [zone.id, zoneKey, zoneName, minutesRequired, pointsGranted, router]);

  // -- DELETE
  const handleDelete = useCallback(async () => {
    if (!window.confirm("Willst du diese Zone wirklich löschen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/zones/${zone.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(
          `Fehler beim Löschen: ${errData.error ?? response.statusText}`
        );
        return;
      }

    //  alert("Zone wurde gelöscht!");
      router.push("/dashboard/zones");
    } catch (error) {
      console.error("handleDelete error:", error);
      alert("Unerwarteter Fehler beim Löschen: " + String(error));
    }
  }, [zone.id, router]);

  return (
    <Stack spacing={2}>
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
        <Button
          color="error"
          variant="outlined"
          sx={{ flex: 1 }}
          onClick={handleDelete}
        >
          Löschen
        </Button>
        <Button
          variant="contained"
          sx={{ flex: 3 }}
          onClick={handleSave}
        >
          Änderungen Speichern
        </Button>
      </Stack>
    </Stack>
  );
}
