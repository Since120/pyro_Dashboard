"use client";

import * as React from "react";
import { useSelection } from "@/hooks/use-selection"; 
import type { Selection } from "@/hooks/use-selection";

import type { ZoneResult } from "@/app/dashboard/zones/ZonesPageClient.types"; 
// ... oder direkt { id:string;...}

function noop(): void {
  // No operation
}

export interface ZonesSelectionContextValue extends Selection {}

export const ZonesSelectionContext = React.createContext<ZonesSelectionContextValue>({
  deselectAll: noop,
  deselectOne: noop,
  selectAll: noop,
  selectOne: noop,
  selected: new Set(),
  selectedAny: false,
  selectedAll: false,
});

interface ZonesSelectionProviderProps {
  children: React.ReactNode;
  zones: ZoneResult[]; // Array an Zonen
}

export function ZonesSelectionProvider({
  children,
  zones,
}: ZonesSelectionProviderProps): React.JSX.Element {
  // IDs aller Zonen
  const zoneIds = React.useMemo(() => zones.map((z) => z.id), [zones]);

  // useSelection: custom Hook (siehe "customers-selection-context"-Vorbild)
  // du brauchst "apps/dashboard/src/hooks/use-selection.ts" 
  const selection = useSelection(zoneIds);

  return (
    <ZonesSelectionContext.Provider value={{ ...selection }}>
      {children}
    </ZonesSelectionContext.Provider>
  );
}

export function useZonesSelection(): ZonesSelectionContextValue {
  return React.useContext(ZonesSelectionContext);
}
