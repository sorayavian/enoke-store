"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Revela o conteúdo ao entrar na viewport (scroll reveal).
// Leve: usa IntersectionObserver e dispara uma única vez.
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — ref polimórfico simples
      ref={ref}
      className={className}
      style={{
        opacity: visible ? undefined : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition:
          "opacity 0.9s cubic-bezier(0.22,0.61,0.36,1), transform 0.9s cubic-bezier(0.22,0.61,0.36,1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
