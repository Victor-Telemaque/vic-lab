"use client";

import { useCallback, useEffect, useState } from "react";
import { inspirationalPatches } from "@/data/portfolio-content";

const LEGACY_STORAGE_KEY = "vic-lab-patch-layout-v2";

export type PatchLayoutEntry = {
  x: number;
  y: number;
  rotate: number;
  removed: boolean;
};

export type PatchLayoutState = Record<string, PatchLayoutEntry>;

function hasAllPatchEntries(layout: PatchLayoutState): boolean {
  return inspirationalPatches.every((patch) => Boolean(layout[patch.id]));
}

export function usePatchLayout() {
  const [layout, setLayout] = useState<PatchLayoutState | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const commitLayout = useCallback((next: PatchLayoutState) => {
    setLayout(next);
  }, []);

  const setInitialLayout = useCallback((initial: PatchLayoutState) => {
    setLayout((current) => {
      if (current && hasAllPatchEntries(current)) {
        return current;
      }
      return initial;
    });
  }, []);

  const updatePatch = useCallback((id: string, patch: Partial<PatchLayoutEntry>) => {
    setLayout((current) => {
      if (!current?.[id]) {
        return current;
      }
      return {
        ...current,
        [id]: { ...current[id], ...patch },
      };
    });
  }, []);

  return {
    layout,
    isReady: layout !== null && hasAllPatchEntries(layout),
    updatePatch,
    setInitialLayout,
    commitLayout,
  };
}
