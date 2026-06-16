"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

// Carrossel-vitrine da home — exibe as imagens da campanha Enoke em tela cheia
// do hero. As imagens já trazem seu próprio texto/identidade, então o carrossel
// não sobrepõe texto: apenas controles discretos (setas, dots, pausar/play).
// Base em CSS Scroll Snap (swipe nativo no mobile); JS mínimo para sincronia,
// teclado e autoplay (pausável e desligado em prefers-reduced-motion).

type Slide = {
  image: string;
  alt: string;
  // Dimensões reais da imagem — o slide assume essa proporção, então a imagem
  // aparece INTEIRA (sem corte) e sem faixas, adaptando-se a cada resolução.
  w: number;
  h: number;
};

const SLIDES: Slide[] = [
  {
    image: "/carrossel/01-otica-online.png",
    alt: "Modelo usando óculos de sol Enoke — sua ótica on-line",
    w: 1366,
    h: 768,
  },
  {
    image: "/carrossel/02-mood.png",
    alt: "Vários óculos Enoke — um óculos para cada mood",
    w: 1080,
    h: 1080,
  },
  {
    image: "/carrossel/03-armacoes-crop.png",
    alt: "Modelos de armação Enoke — encontre o ideal para você",
    w: 1080,
    h: 607,
  },
  {
    image: "/carrossel/05-marca.png",
    alt: "Enoke Eyewear Store",
    w: 1050,
    h: 600,
  },
];

const AUTOPLAY_MS = 5000;

export function HeroCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [tocando, setTocando] = useState(true);
  const [reduzMovimento, setReduzMovimento] = useState(false);
  const pausadoRef = useRef(false);

  const total = SLIDES.length;

  // Respeita a preferência por menos movimento (desliga o autoplay).
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

  // Vai para um slide (Scroll Snap encaixa); smooth respeita reduced-motion.
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

  // Mantém o dot ativo em sincronia com a rolagem (inclui swipe manual).
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

  // Autoplay: avança, pausa no hover/foco, respeita reduced-motion.
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

  // Setas do teclado quando o carrossel tem foco.
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
      aria-label="Destaques Enoke"
      className="relative overflow-hidden bg-surface-dark"
      onMouseEnter={() => (pausadoRef.current = true)}
      onMouseLeave={() => (pausadoRef.current = false)}
      onFocusCapture={() => (pausadoRef.current = true)}
      onBlurCapture={() => (pausadoRef.current = false)}
      onKeyDown={onKeyDown}
    >
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
            {/* O slide assume a proporção real da imagem (aspect-ratio), então
                a imagem aparece INTEIRA, sem corte e sem faixas, ajustando-se
                a qualquer resolução. */}
            <Image
              src={s.image}
              alt={s.alt}
              width={s.w}
              height={s.h}
              priority={i === 0}
              sizes="100vw"
              className="h-auto w-full bg-surface-dark"
              style={{ aspectRatio: `${s.w} / ${s.h}` }}
            />
          </div>
        ))}
      </div>

      {/* Controles prev / next (desktop) */}
      <button
        type="button"
        onClick={() => irPara(ativo - 1)}
        aria-label="Slide anterior"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-sm transition-colors duration-feedback hover:border-brand hover:text-brand md:block"
      >
        <ChevronLeft size={22} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={() => irPara(ativo + 1)}
        aria-label="Próximo slide"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-sm transition-colors duration-feedback hover:border-brand hover:text-brand md:block"
      >
        <ChevronRight size={22} strokeWidth={1.5} />
      </button>

      {/* Dots + pausar/play, sobre uma faixa de leitura na base */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent">
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
                aria-label={`Ir para o destaque ${i + 1} de ${total}`}
                onClick={() => irPara(i)}
                className={
                  "h-1.5 rounded-full transition-all duration-content ease-refined " +
                  (ativo === i
                    ? "w-8 bg-brand"
                    : "w-3 bg-white/40 hover:bg-white/70")
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
              className="inline-flex items-center gap-2 rounded-sm border border-white/25 bg-black/30 px-3 py-1.5 text-caption uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm transition-colors duration-feedback hover:border-brand hover:text-brand"
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
