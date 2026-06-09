"use client";

import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { inspirationalPatches } from "@/data/portfolio-content";
import type { PatchLayoutState } from "@/hooks/use-patch-layout";

const PATCH_COUNT = inspirationalPatches.length;

type ViewportSlot = {
  anchor: "left" | "right" | "center";
  x: number;
  y: number;
};

/** Vertical slots only — horizontal placement stays in page side gutters. */
const PATCH_VIEWPORT_SLOTS: ViewportSlot[] = [
  { anchor: "left", x: 0, y: 0.14 },
  { anchor: "right", x: 0, y: 0.1 },
  { anchor: "left", x: 0, y: 0.42 },
  { anchor: "right", x: 0, y: 0.56 },
  { anchor: "left", x: 0, y: 0.7 },
  { anchor: "right", x: 0, y: 0.26 },
];

function getStampWidth(viewportWidth: number): number {
  if (viewportWidth <= 520) {
    return Math.min(viewportWidth * 0.42, 168);
  }
  if (viewportWidth <= 768) {
    return Math.min(viewportWidth * 0.4, 260);
  }
  return Math.min(viewportWidth * 0.34, 420);
}

function getRevealThreshold(appearOrder: number): number {
  return (appearOrder + 1) / (PATCH_COUNT + 1);
}

function getPostHeroScrollProgress(): number {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const maxScroll = document.documentElement.scrollHeight - viewportHeight;
  const start = viewportHeight * 0.55;
  const range = Math.max(1, maxScroll - start);

  return Math.min(1, Math.max(0, (scrollY - start) / range));
}

function getContentColumnBounds(viewportWidth: number) {
  const pageGutter = Math.min(48, viewportWidth * 0.06);
  const contentWidth = Math.min(1000, viewportWidth - pageGutter * 2);
  const contentLeft = (viewportWidth - contentWidth) / 2;

  return {
    contentLeft,
    contentRight: contentLeft + contentWidth,
    gutterWidth: contentLeft,
  };
}

function slotToDocumentPosition(
  slot: ViewportSlot,
  scrollY: number,
  viewportWidth: number,
  viewportHeight: number,
  stampWidth: number,
): { x: number; y: number } {
  const edge = Math.max(8, viewportWidth * 0.02);
  const { contentLeft, contentRight, gutterWidth } =
    getContentColumnBounds(viewportWidth);

  let x = edge;

  const isNarrow = gutterWidth < stampWidth * 0.35;

  if (slot.anchor === "left") {
    x = isNarrow
      ? -stampWidth * 0.42
      : Math.max(edge, contentLeft - stampWidth * 0.62);
  } else if (slot.anchor === "right") {
    x = isNarrow
      ? viewportWidth - stampWidth * 0.58
      : Math.min(
          viewportWidth - stampWidth - edge,
          contentRight - stampWidth * 0.38,
        );
  } else {
    x = edge;
  }

  const y = scrollY + slot.y * viewportHeight;

  return { x, y };
}

type Options = {
  enabled: boolean;
  isReady: boolean;
  layout: PatchLayoutState | null;
  updatePatch: (id: string, patch: Partial<PatchLayoutState[string]>) => void;
  shouldReduceMotion: boolean | null;
};

export function useScrollPatchReveal({
  enabled,
  isReady,
  layout,
  updatePatch,
  shouldReduceMotion,
}: Options) {
  const lenis = useLenis();
  const [placedIds, setPlacedIds] = useState<Set<string>>(new Set());
  const placedIdsRef = useRef(placedIds);
  placedIdsRef.current = placedIds;

  const revealPatch = useCallback(
    (patchId: string, appearOrder: number) => {
      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const stampWidth = getStampWidth(viewportWidth);
      const slot = PATCH_VIEWPORT_SLOTS[appearOrder] ?? PATCH_VIEWPORT_SLOTS[0];
      const { x, y } = slotToDocumentPosition(
        slot,
        scrollY,
        viewportWidth,
        viewportHeight,
        stampWidth,
      );

      updatePatch(patchId, { x, y });
      setPlacedIds((current) => {
        if (current.has(patchId)) {
          return current;
        }
        const next = new Set(current);
        next.add(patchId);
        return next;
      });
    },
    [updatePatch],
  );

  const syncReveal = useCallback(() => {
    if (!enabled || !isReady || !layout) {
      return;
    }

    const progress = getPostHeroScrollProgress();
    const sortedPatches = [...inspirationalPatches].sort(
      (a, b) => a.appearOrder - b.appearOrder,
    );

    for (const patch of sortedPatches) {
      if (placedIdsRef.current.has(patch.id) || layout[patch.id]?.removed) {
        continue;
      }

      if (progress >= getRevealThreshold(patch.appearOrder)) {
        revealPatch(patch.id, patch.appearOrder);
      }
    }
  }, [enabled, isReady, layout, revealPatch]);

  useEffect(() => {
    if (!enabled || !isReady || !layout) {
      return;
    }

    if (shouldReduceMotion) {
      const sortedPatches = [...inspirationalPatches].sort(
        (a, b) => a.appearOrder - b.appearOrder,
      );
      for (const patch of sortedPatches) {
        if (!layout[patch.id]?.removed) {
          revealPatch(patch.id, patch.appearOrder);
        }
      }
      return;
    }

    syncReveal();
    window.addEventListener("scroll", syncReveal, { passive: true });
    window.addEventListener("resize", syncReveal, { passive: true });
    lenis?.on("scroll", syncReveal);

    return () => {
      window.removeEventListener("scroll", syncReveal);
      window.removeEventListener("resize", syncReveal);
      lenis?.off("scroll", syncReveal);
    };
  }, [enabled, isReady, layout, lenis, revealPatch, shouldReduceMotion, syncReveal]);

  return placedIds;
}
