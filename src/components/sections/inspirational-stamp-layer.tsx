"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import {
  inspirationalPatches,
  type InspirationalPatch,
} from "@/data/portfolio-content";
import {
  usePatchLayout,
  type PatchLayoutEntry,
  type PatchLayoutState,
} from "@/hooks/use-patch-layout";
import { useScrollPatchReveal } from "@/hooks/use-scroll-patch-reveal";
import styles from "./inspirational-stamp-layer.module.scss";

const STAMP_SIZE_FALLBACK = 400;

type Props = {
  isRevealed?: boolean;
};

function placementToPosition(
  patch: InspirationalPatch,
  layerWidth: number,
  layerHeight: number,
  stampWidth: number,
): { x: number; y: number } {
  const top = (parseFloat(patch.placement.top) / 100) * layerHeight;
  let x = 0;

  if (patch.placement.left) {
    x = (parseFloat(patch.placement.left) / 100) * layerWidth;
  } else if (patch.placement.right) {
    const right = (parseFloat(patch.placement.right) / 100) * layerWidth;
    x = layerWidth - right - stampWidth;
  }

  return { x, y: top };
}

export function InspirationalStampLayer({ isRevealed = false }: Props) {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const peelZoneRef = useRef<HTMLDivElement>(null);
  const { layout, isReady, updatePatch, setInitialLayout } = usePatchLayout();
  const placedIds = useScrollPatchReveal({
    enabled: isRevealed,
    isReady,
    layout,
    updatePatch,
    shouldReduceMotion,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const computeInitialLayout = useCallback((): PatchLayoutState => {
    const layer = layerRef.current;
    const width = layer?.offsetWidth ?? window.innerWidth;
    const height = layer?.offsetHeight ?? document.documentElement.scrollHeight;
    const stampWidth = STAMP_SIZE_FALLBACK;

    return Object.fromEntries(
      inspirationalPatches.map((patch) => {
        const { x, y } = placementToPosition(patch, width, height, stampWidth);
        return [
          patch.id,
          { x, y, rotate: patch.rotate, removed: false } satisfies PatchLayoutEntry,
        ];
      }),
    );
  }, []);

  useEffect(() => {
    if (isReady) {
      return;
    }

    const layer = layerRef.current;
    if (!layer) {
      return;
    }

    const tryInit = () => {
      if (isReady) {
        return;
      }
      const height = Math.max(
        layer.offsetHeight,
        layer.scrollHeight,
        document.documentElement.clientHeight,
      );
      if (layer.offsetWidth < 200 || height < 320) {
        return;
      }
      setInitialLayout(computeInitialLayout());
    };

    tryInit();
    const frame = window.requestAnimationFrame(tryInit);

    const observer = new ResizeObserver(tryInit);
    observer.observe(layer);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [computeInitialLayout, isReady, setInitialLayout]);

  const handleDragEnd = useCallback(
    (patchId: string, entry: PatchLayoutEntry, info: PanInfo) => {
      setIsDragging(false);
      setActiveDragId(null);

      const peelZone = peelZoneRef.current?.getBoundingClientRect();
      const pointerX = info.point.x;
      const pointerY = info.point.y;

      if (
        peelZone &&
        pointerX >= peelZone.left &&
        pointerX <= peelZone.right &&
        pointerY >= peelZone.top &&
        pointerY <= peelZone.bottom
      ) {
        updatePatch(patchId, { removed: true });
        return;
      }

      updatePatch(patchId, {
        x: entry.x + info.offset.x,
        y: entry.y + info.offset.y,
      });
    },
    [updatePatch],
  );

  if (!isReady || !layout) {
    return <div ref={layerRef} className={styles.layer} />;
  }

  const visiblePatches = inspirationalPatches.filter(
    (patch) => !layout[patch.id]?.removed,
  );

  return (
    <div ref={layerRef} className={styles.layer}>
      <AnimatePresence>
        {isDragging ? (
          <motion.div
            ref={peelZoneRef}
            className={styles.peelZone}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {intl.formatMessage({ id: "patches.peelHint" })}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {visiblePatches.map((patch) => {
          const entry = layout[patch.id];
          if (!entry || !placedIds.has(patch.id)) {
            return null;
          }

          return (
            <DraggableStamp
              key={patch.id}
              patch={patch}
              entry={entry}
              isActive={activeDragId === patch.id}
              onDragStart={() => {
                setIsDragging(true);
                setActiveDragId(patch.id);
              }}
              onDragEnd={(info) => {
                const current = layout[patch.id];
                if (current) {
                  handleDragEnd(patch.id, current, info);
                }
              }}
              onRemove={() => updatePatch(patch.id, { removed: true })}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

type DraggableStampProps = {
  patch: InspirationalPatch;
  entry: PatchLayoutEntry;
  isActive: boolean;
  onDragStart: () => void;
  onDragEnd: (info: PanInfo) => void;
  onRemove: () => void;
};

function DraggableStamp({
  patch,
  entry,
  isActive,
  onDragStart,
  onDragEnd,
  onRemove,
}: DraggableStampProps) {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: entry.x, y: entry.y });
  const [hasLanded, setHasLanded] = useState(shouldReduceMotion);

  useEffect(() => {
    setPosition({ x: entry.x, y: entry.y });
  }, [entry.x, entry.y]);

  return (
    <motion.div
      className={`${styles.stamp} ${isActive ? styles.stampDragging : ""}`}
      style={{ position: "absolute", top: 0, left: 0 }}
      initial={
        shouldReduceMotion
          ? false
          : {
              x: position.x,
              y: position.y - 58,
              scale: 1.42,
              rotate: entry.rotate - 16,
              opacity: 0.35,
            }
      }
      animate={{
        x: position.x,
        y: position.y,
        scale: 1,
        rotate: entry.rotate,
        opacity: 1,
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.22 } }}
      transition={
        hasLanded
          ? { x: { duration: 0 }, y: { duration: 0 } }
          : {
              type: "spring",
              stiffness: 430,
              damping: 16,
              mass: 0.9,
            }
      }
      drag
      dragMomentum={false}
      dragElastic={0.06}
      whileDrag={{
        scale: 1.07,
        rotate: entry.rotate + 4,
        zIndex: 40,
      }}
      onDragStart={onDragStart}
      onDragEnd={(_, info) => onDragEnd(info)}
      onAnimationComplete={() => setHasLanded(true)}
      role="group"
      aria-label={patch.alt}
    >
      <span className={styles.stampImpact} aria-hidden />
      <Image
        src={patch.src}
        alt=""
        width={640}
        height={640}
        sizes="(max-width: 520px) 280px, (max-width: 768px) 320px, 420px"
        className={styles.stampImage}
        draggable={false}
      />
      <button
        type="button"
        className={styles.stampRemove}
        aria-label={`${intl.formatMessage({ id: "patches.remove" })} — ${patch.alt}`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
      >
        <span aria-hidden>×</span>
      </button>
      <span className={styles.srOnly}>
        {patch.alt}. {intl.formatMessage({ id: "patches.dragHint" })}
      </span>
    </motion.div>
  );
}
