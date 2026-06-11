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
  return <script dangerouslySetInnerHTML={{ __html: heroGateInitScript }} />;
}
