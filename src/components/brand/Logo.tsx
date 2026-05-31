import Link from "next/link";
import Image from "next/image";

// Logo da marca Enoke: leão dourado oficial (PNG transparente) + wordmark
// "Enōke". O brasão fica em public/enoke-leao.png — é o logo real da ótica.

type LogoProps = {
  /** "onDark" para header/footer escuros (wordmark claro); "onLight" para fundos claros. */
  variant?: "onDark" | "onLight";
  /** Exibe apenas o brasão do leão, sem o texto. */
  iconOnly?: boolean;
  className?: string;
};

export function Logo({
  variant = "onDark",
  iconOnly = false,
  className = "",
}: LogoProps) {
  const wordmark = variant === "onDark" ? "text-fg-onDark" : "text-fg";
  const subtitle =
    variant === "onDark" ? "text-fg-onDarkMuted" : "text-fg-subtle";

  return (
    <Link
      href="/"
      aria-label="Enoke Eyewear Store — início"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <Image
        src="/enoke-leao.png"
        alt="Enoke"
        width={234}
        height={264}
        priority
        className="h-10 w-auto shrink-0 transition-transform duration-150 group-hover:scale-105"
      />
      {!iconOnly && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display text-2xl font-semibold tracking-tight ${wordmark}`}
          >
            Enōke
          </span>
          <span
            className={`mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] ${subtitle}`}
          >
            Eyewear Store
          </span>
        </span>
      )}
    </Link>
  );
}
