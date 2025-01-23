// apps/dashboard/src/app/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

// Wir nehmen children als Prop,
// um sie in <SessionProvider> zu wrappen.
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
