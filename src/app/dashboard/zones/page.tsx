import * as React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ZonesPageClient from "./ZonesPageClient";

/** Optional: Title für <head> */
export const metadata: Metadata = {
  title: "Zonen – erweiterter Modus",
};

/**
 * SSR-Funktion, die Zonen + aggregated Stats aus DB holt.
 */
async function getZonesData() {
  // 1) Hole alle Zonen-Datensätze
  const dbZones = await prisma.zone.findMany();

  // 2) Für jede Zone => userZoneStats aggregieren
  const results = [];

  for (const z of dbZones) {
    // userZoneStats pro zoneKey
    const stats = await prisma.userZoneStats.aggregate({
      where: { zoneKey: z.zoneKey },
      _sum: { totalSecondsInZone: true },
      _max: { lastUsage: true },
    });

    const totalSec = stats._sum.totalSecondsInZone ?? 0;
    const lastUsage = stats._max.lastUsage ?? null; // jetzt lastUsage
    
    // – Dummy-Kategorie
    const categoryName = "Kategorie A";

    results.push({
      id: z.id,
      zoneKey: z.zoneKey,
      zoneName: z.zoneName,
      minutesRequired: z.minutesRequired,
      pointsGranted: z.pointsGranted,
      totalSecondsInZone: totalSec,
      categoryName,
      lastUsage,
    });
  }

  return results;
}

/**
 * Server-Seite: /dashboard/zones
 */
export default async function Page() {
  // DB-Aufruf (SSR)
  const zonen = await getZonesData();

  // Dann geben wir diese (SSR)-Daten an die Client-Komponente
  return <ZonesPageClient zonen={zonen} />;
}
