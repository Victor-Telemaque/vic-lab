import Script from "next/script";

const themeInitScript = `
(function () {
  try {
    var storageKey = "portfolio-theme";
    var stored = localStorage.getItem(storageKey);
    var theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch (error) {}
})();
`;

export function ThemeInitScript() {
  return (
    <Script
      id="portfolio-theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
