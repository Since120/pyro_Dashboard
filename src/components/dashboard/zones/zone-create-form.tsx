"use client";

import * as React from "react";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export function ZoneCreateForm() {
  // States
  const [zoneKey, setZoneKey] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [minutesRequired, setMinutesRequired] = useState<number>(60);
  const [pointsGranted, setPointsGranted] = useState<number>(1);

  // Handler
  const handleSave = React.useCallback(async () => {
    // 1) Payload bauen
    const payload = {
      zoneKey,
      zoneName,
      minutesRequired,
      pointsGranted,
    };

    try {
      // 2) fetch => POST /api/zones
      const response = await fetch("/api/zones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Fehlerhandling
        const errorData = await response.json();
        alert("Fehler beim Erstellen: " + (errorData.error ?? response.status));
        return;
      }

      // 3) Erfolg
      const createdZone = await response.json();
      window.location.href = "/dashboard/zones";
      // e.g. window.location.href = "/dashboard/zones"
    } catch (error) {
      console.error("handleSave error:", error);
      alert("Unerwarteter Fehler: " + String(error));
    }
  }, [zoneKey, zoneName, minutesRequired, pointsGranted]);

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

      <Button variant="contained" onClick={handleSave}>
        Speichern
      </Button>
    </Stack>
  );
}
