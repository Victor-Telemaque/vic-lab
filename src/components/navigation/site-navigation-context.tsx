"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";

type SiteNavigationContextValue = {
  navigateToSection: (sectionId: string) => void;
  registerHeroExit: (playExit: (() => void) | null) => void;
  setHeroGated: (gated: boolean) => void;
  isPostHero: boolean;
  setPostHero: (value: boolean) => void;
};

const SiteNavigationContext = createContext<SiteNavigationContextValue | null>(
  null,
);

type ProviderProps = {
  children: ReactNode;
  initialPostHero?: boolean;
};

export function SiteNavigationProvider({
  children,
  initialPostHero = false,
}: ProviderProps) {
  const scrollToSection = useScrollToSection();
  const shouldReduceMotion = useReducedMotion();
  const heroExitRef = useRef<(() => void) | null>(null);
  const isHeroGatedRef = useRef(false);
  const [isPostHero, setPostHero] = useState(initialPostHero);
  const [pendingSectionId, setPendingSectionId] = useState<string | null>(null);

  const registerHeroExit = useCallback((playExit: (() => void) | null) => {
    heroExitRef.current = playExit;
  }, []);

  const setHeroGated = useCallback((gated: boolean) => {
    isHeroGatedRef.current = gated;
  }, []);

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (isHeroGatedRef.current && !shouldReduceMotion) {
        setPendingSectionId(sectionId);
        heroExitRef.current?.();
        return;
      }

      scrollToSection(sectionId);
    },
    [scrollToSection, shouldReduceMotion],
  );

  useEffect(() => {
    if (!pendingSectionId || !isPostHero) {
      return;
    }

    const sectionId = pendingSectionId;
    setPendingSectionId(null);

    const timer = window.setTimeout(() => {
      scrollToSection(sectionId);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [pendingSectionId, isPostHero, scrollToSection]);

  return (
    <SiteNavigationContext.Provider
      value={{
        navigateToSection,
        registerHeroExit,
        setHeroGated,
        isPostHero,
        setPostHero,
      }}
    >
      {children}
    </SiteNavigationContext.Provider>
  );
}

export function useSiteNavigation() {
  const context = useContext(SiteNavigationContext);
  if (!context) {
    throw new Error(
      "useSiteNavigation must be used within SiteNavigationProvider",
    );
  }
  return context;
}
