// apps/dashboard/src/components/dashboard/categories/zones/types.ts

/** Der Haupt-Typ, den unsere Tabelle anzeigt */
export interface ZoneResult {
    id: string;
    zoneKey: string;
    zoneName: string;
    minutesRequired: number;
    pointsGranted: number;
    totalSecondsInZone: number;
    categoryName: string | null;
    lastUsage: Date | null;
  }
  