import type { Config } from "tailwindcss";

const config: Config = {
  // Dark mode por classe — só a loja recebe a classe .dark (escopada).
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Tema do painel admin (escuro) — NÃO ALTERAR: o admin depende destes hex ---
        bone: "#2A2A2D",
        paper: "#34343A",
        mist: "#44444B",
        stone: {
          100: "#5A5A60",
          300: "#8E8E94",
          500: "#B8B8BD",
        },
        ink: {
          DEFAULT: "#F2EFEA",
          deep: "#FFFFFF",
        },
        amber: {
          DEFAULT: "#8C6A2F",
          soft: "#C9A66B",
          tint: "#F3EBD8",
        },
        success: "#3F5E3E",
        warning: "#8A6A1F",
        danger: "#7A2E22",

        // --- Identidade da loja (claro + dourado), fiel ao enoke.com.br ---
        // Os tokens da loja usam CSS variables (definidas em globals.css sob
        // .loja-theme e .loja-theme.dark) para suportar dark mode sem reescrever
        // as classes nas páginas. O dourado da marca é igual nos dois temas;
        // brand-text troca (mais claro no escuro) para manter contraste.
        brand: {
          DEFAULT: "#F1C40F",
          soft: "#F5D27A",
          deep: "#CAA20A",
          // Dourado acessível para texto pequeno — varia por tema (ver globals.css).
          text: "var(--brand-text)",
          ink: "#161616",
        },
        // Superfícies da loja. surface/surface-alt trocam por tema;
        // surface-dark/darkAlt são SEMPRE escuras (header/footer/blocos de impacto).
        surface: {
          DEFAULT: "var(--surface)",
          alt: "var(--surface-alt)",
          dark: "#161616",
          darkAlt: "#1A1A1A",
        },
        // Texto da loja. fg/muted/subtle trocam por tema; onDark/onDarkMuted são
        // para texto sobre blocos sempre-escuros (não trocam).
        fg: {
          DEFAULT: "var(--fg)",
          muted: "var(--fg-muted)",
          subtle: "var(--fg-subtle)",
          onDark: "#FAF9F7",
          onDarkMuted: "#A8A8A8",
        },
        // Linhas/divisórias da loja. line troca por tema; line-dark é fixa.
        line: {
          DEFAULT: "var(--line)",
          dark: "#2A2A2A",
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        "display-xl": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-md": ["1.75rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },
      boxShadow: {
        hairline: "0 0 0 1px #44444B",
        soft: "0 1px 2px rgba(28,26,22,0.04), 0 8px 24px rgba(28,26,22,0.04)",
        modal: "0 24px 64px rgba(14,13,10,0.18)",
      },
      transitionTimingFunction: {
        refined: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      transitionDuration: {
        feedback: "150ms",
        ui: "240ms",
        content: "320ms",
      },
    },
  },
  plugins: [],
};
export default config;
