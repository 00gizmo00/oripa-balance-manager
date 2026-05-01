"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { useOripaAppState } from "@/lib/app-state";

const AppDataContext = createContext<ReturnType<typeof useOripaAppState> | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const value = useOripaAppState();

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider.");
  }
  return context;
}
