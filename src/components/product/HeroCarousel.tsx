"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

// Carrossel de destaques da home — base em CSS Scroll Snap (swipe nativo no
// mobile, zero dependência de slider pesado). JS só para: dot ativo, prev/next,
// teclado e autoplay opcional (pausável e desligado em prefers-reduced-motion).

type Slide = {
  eyebrow: string;
  titulo: React.ReactNode;
  subtitulo: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  alt: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Nova coleção · 2026",
    titulo: (
      <>
        Visão <span className="italic text-brand">&amp; Propósito</span>
      </>
    ),
    subtitulo:
      "Armações autorais, acetato italiano e titânio escovado — curadoria para quem escolhe poucas peças e as escolhe bem.",
    ctaLabel: "Ver catálogo",
    ctaHref: "/catalogo",
    image: "/placeholders/lume-titanio-bronze-1.svg",
    alt: "Armação Lume em titânio bronze",
  },
  {
    eyebrow: "Proteção com estilo",
    titulo: (
      <>
        Óculos de <span className="italic text-brand">Sol</span>
      </>
    ),
    subtitulo:
      "Lentes com proteção UV e desenho que acompanha o seu olhar do dia à noite.",
    ctaLabel: "Ver solares",
    ctaHref: "/catalogo?estilo=sol",
    image: "/placeholders/orto-aviador-prata-1.svg",
    alt: "Óculos de sol modelo Orto aviador prata",
  },
  {
    eyebrow: "Engenharia & leveza",
    titulo: (
      <>
        Titânio <span className="italic text-brand">essencial</span>
      </>
    ),
    subtitulo:
      "Resistência e leveza em armações que você esquece estar usando.",
    ctaLabel: "Explorar titânio",
    ctaHref: "/catalogo?material=Titânio",
    image: "/placeholders/aurora-acetato-grafite-1.svg",
    alt: "Armação Aurora em acetato grafite",
  },
  {
    eyebrow: "Detalhe que assina",
    titulo: (
      <>
        Metal <span className="italic text-brand">dourado</span>
      </>
    ),
    subtitulo:
      "Acabamento em metal com toque dourado — sofisticação discreta no rosto.",
    ctaLabel: "Ver modelos",
    ctaHref: "/catalogo?material=Metal",
    image: "/placeholders/siena-metal-dourado-1.svg",
    alt: "Armação Siena em metal dourado",
  },
];

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [tocando, setTocando] = useState(true);
  const [reduzMovimento, setReduzMovimento] = useState(false);
  const pausadoRef = useRef(false);

  const total = SLIDES.length;

  // Respeita a preferência do usuário por menos movimento (desliga autoplay).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduzMovimento(mq.matches);
      if (mq.matches) setTocando(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Vai para um slide específico, rolando o track (Scroll Snap cuida do encaixe).
  const irPara = useCallback(
    (i: number, smooth = true) => {
      const track = trackRef.current;
      if (!track) return;
      const idx = (i + total) % total;
      const slide = track.children[idx] as HTMLElement | undefined;
      if (slide) {
        track.scrollTo({
          left: slide.offsetLeft,
          behavior: reduzMovimento || !smooth ? "auto" : "smooth",
        });
      }
    },
    [total, reduzMovimento]
  );

  // Mantém o dot ativo sincronizado com a rolagem (inclui swipe manual).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        setAtivo(Math.max(0, Math.min(total - 1, i)));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  // Autoplay: avança sozinho, pausa no hover/foco e respeita reduced-motion.
  useEffect(() => {
    if (!tocando || reduzMovimento) return;
    const id = setInterval(() => {
      if (!pausadoRef.current) {
        setAtivo((cur) => {
          const prox = (cur + 1) % total;
          irPara(prox);
          return prox;
        });
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [tocando, reduzMovimento, total, irPara]);

  // Navegação por teclado (setas) quando o carrossel tem foco.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      irPara(ativo - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      irPara(ativo + 1);
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Destaques da loja"
      className="grain relative overflow-hidden bg-surface-dark text-fg-onDark"
      onMouseEnter={() => (pausadoRef.current = true)}
      onMouseLeave={() => (pausadoRef.current = false)}
      onFocusCapture={() => (pausadoRef.current = true)}
      onBlurCapture={() => (pausadoRef.current = false)}
      onKeyDown={onKeyDown}
    >
      {/* Brilho dourado de atmosfera */}
      <div
        aria-hidden
        className="glow pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand/20 blur-[120px]"
      />

      {/* Trilho rolável — Scroll Snap horizontal */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        aria-live="polite"
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            aria-hidden={ativo !== i}
            className="relative w-full shrink-0 snap-center"
          >
            <div className="container-page grid items-center gap-10 py-20 md:grid-cols-12 md:py-28">
              <div className="md:col-span-7">
                <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.22em] text-brand">
                  <span className="inline-block h-px w-10 bg-brand" />
                  {s.eyebrow}
                </p>
                <h2 className="mt-7 font-display text-[2.75rem] font-light leading-[0.98] tracking-tight md:text-display-2xl">
                  {s.titulo}
                </h2>
                <p className="mt-6 max-w-md text-pretty text-fg-onDarkMuted">
                  {s.subtitulo}
                </p>
                <Link
                  href={s.ctaHref}
                  tabIndex={ativo === i ? 0 : -1}
                  className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-brand px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-brand-ink transition-all duration-ui hover:gap-5 hover:bg-brand-soft"
                >
                  {s.ctaLabel}
                  <span aria-hidden>→</span>
                </Link>
              </div>

              <div className="md:col-span-5">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm border border-white/10 bg-white/[0.02]">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles prev / next (desktop) */}
      <button
        type="button"
        onClick={() => irPara(ativo - 1)}
        aria-label="Slide anterior"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/15 bg-surface-dark/60 p-3 text-fg-onDark backdrop-blur-sm transition-colors duration-feedback hover:border-brand hover:text-brand md:block"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={() => irPara(ativo + 1)}
        aria-label="Próximo slide"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/15 bg-surface-dark/60 p-3 text-fg-onDark backdrop-blur-sm transition-colors duration-feedback hover:border-brand hover:text-brand md:block"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Rodapé do carrossel: dots + pausar/play */}
      <div className="relative border-t border-white/10">
        <div className="container-page flex items-center justify-between gap-4 py-4">
          <div
            className="flex items-center gap-2.5"
            role="tablist"
            aria-label="Selecionar destaque"
          >
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={ativo === i}
                aria-label={`Ir para o slide ${i + 1} de ${total}`}
                onClick={() => irPara(i)}
                className={
                  "h-1.5 rounded-full transition-all duration-content ease-refined " +
                  (ativo === i
                    ? "w-8 bg-brand"
                    : "w-3 bg-white/25 hover:bg-white/50")
                }
              />
            ))}
          </div>

          {!reduzMovimento && (
            <button
              type="button"
              onClick={() => setTocando((t) => !t)}
              aria-label={
                tocando ? "Pausar apresentação" : "Iniciar apresentação"
              }
              className="inline-flex items-center gap-2 rounded-sm border border-white/15 px-3 py-1.5 text-caption uppercase tracking-[0.14em] text-fg-onDarkMuted transition-colors duration-feedback hover:border-brand hover:text-brand"
            >
              {tocando ? (
                <Pause size={13} strokeWidth={1.8} />
              ) : (
                <Play size={13} strokeWidth={1.8} />
              )}
              {tocando ? "Pausar" : "Reproduzir"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
