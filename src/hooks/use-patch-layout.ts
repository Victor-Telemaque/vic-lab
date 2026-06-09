"use client";

import { useCallback, useState } from "react";
import { inspirationalPatches } from "@/data/portfolio-content";

const STORAGE_KEY = "vic-lab-patch-layout-v2";

export type PatchLayoutEntry = {
  x: number;
  y: number;
  rotate: number;
  removed: boolean;
};

export type PatchLayoutState = Record<string, PatchLayoutEntry>;

function readStoredLayout(): PatchLayoutState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as PatchLayoutState;
  } catch {
    return null;
  }
}

function hasAllPatchEntries(layout: PatchLayoutState): boolean {
  return inspirationalPatches.every((patch) => Boolean(layout[patch.id]));
}

function mergeWithStored(initial: PatchLayoutState): PatchLayoutState {
  const stored = readStoredLayout();
  if (!stored) {
    return initial;
  }

  const merged = { ...initial };

  for (const patch of inspirationalPatches) {
    const saved = stored[patch.id];
    const base = initial[patch.id];
    if (!base) {
      continue;
    }
    if (saved) {
      merged[patch.id] = {
        ...base,
        ...saved,
        rotate: saved.rotate ?? base.rotate,
      };
    }
  }

  return merged;
}

export function usePatchLayout() {
  const [layout, setLayout] = useState<PatchLayoutState | null>(null);

  const commitLayout = useCallback((next: PatchLayoutState) => {
    setLayout(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota */
    }
  }, []);

  const setInitialLayout = useCallback(
    (initial: PatchLayoutState) => {
      setLayout((current) => {
        if (current && hasAllPatchEntries(current)) {
          return current;
        }
        const next = mergeWithStored(initial);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const updatePatch = useCallback(
    (id: string, patch: Partial<PatchLayoutEntry>) => {
      setLayout((current) => {
        if (!current?.[id]) {
          return current;
        }
        const next = {
          ...current,
          [id]: { ...current[id], ...patch },
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  return {
    layout,
    isReady: layout !== null && hasAllPatchEntries(layout),
    updatePatch,
    setInitialLayout,
    commitLayout,
  };
}
