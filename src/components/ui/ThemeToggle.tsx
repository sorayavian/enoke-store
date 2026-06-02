"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// Botão de alternância de tema (claro/escuro) da loja.
// - Por padrão segue o sistema (prefers-color-scheme).
// - A escolha manual fica salva em localStorage ("enoke-theme").
// - Aplica/remove a classe .dark no <html> (a loja reage via CSS vars).

type Tema = "light" | "dark";

const STORAGE = "enoke-theme";

function aplicar(tema: Tema) {
  const html = document.documentElement;
  if (tema === "dark") html.classList.add("dark");
  else html.classList.remove("dark");
}

export function ThemeToggle() {
  const [tema, setTema] = useState<Tema>("light");
  const [montado, setMontado] = useState(false);

  // Sincroniza com o estado real já aplicado pelo script anti-flash.
  useEffect(() => {
    setTema(document.documentElement.classList.contains("dark") ? "dark" : "light");
    setMontado(true);
  }, []);

  // Se o usuário NÃO escolheu manualmente, acompanha mudanças do sistema.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      if (!localStorage.getItem(STORAGE)) {
        const t: Tema = mq.matches ? "dark" : "light";
        aplicar(t);
        setTema(t);
      }
    };
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const alternar = () => {
    const novo: Tema = tema === "dark" ? "light" : "dark";
    aplicar(novo);
    localStorage.setItem(STORAGE, novo);
    setTema(novo);
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={
        montado
          ? tema === "dark"
            ? "Mudar para tema claro"
            : "Mudar para tema escuro"
          : "Alternar tema"
      }
      title={tema === "dark" ? "Tema claro" : "Tema escuro"}
      className="rounded-sm p-2 text-fg-onDark transition-colors duration-feedback hover:bg-white/10 hover:text-brand"
    >
      {/* Evita mismatch de hidratação: só decide o ícone após montar. */}
      {montado && tema === "dark" ? (
        <Sun size={20} strokeWidth={1.5} />
      ) : (
        <Moon size={20} strokeWidth={1.5} />
      )}
    </button>
  );
}

// Script inline (anti-flash): aplica o tema ANTES da primeira pintura, evitando
// o "flash" de tela clara ao carregar no escuro. Injetado no <head>.
export const themeScript = `
(function(){
  try {
    var s = localStorage.getItem('${STORAGE}');
    var dark = s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;
