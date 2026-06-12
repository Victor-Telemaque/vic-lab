import Script from "next/script";

const heroGateInitScript = `
(function () {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    document.documentElement.classList.add("hero-gate-active");
  } catch (error) {}
})();
`;

export function HeroGateInitScript() {
  return (
    <Script
      id="portfolio-hero-gate-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: heroGateInitScript }}
    />
  );
}
