// apps/dashboard/src/components/dashboard/categories/zones/zones-selection-context.tsx
"use client";

import * as React from "react";
import { useSelection } from "@/hooks/use-selection"; // dein eigener Hook
import type { Selection } from "@/hooks/use-selection";
import type { ZoneResult } from "./types";

function noop() {
  // No operation
}

export interface ZonesSelectionContextValue extends Selection {}

export const ZonesSelectionContext =
  React.createContext<ZonesSelectionContextValue>({
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
  zones: ZoneResult[];
}

/**
 * Kapselt die Multi-Selection (Checkboxen in der Tabelle) 
 * in einem Context.
 */
export function ZonesSelectionProvider({
  children,
  zones,
}: ZonesSelectionProviderProps): React.JSX.Element {
  // IDs aller Zonen
  const zoneIds = React.useMemo(() => zones.map((z) => z.id), [zones]);
  // Dein Hook
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
