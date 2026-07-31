import type { ReactNode } from "react";
import { Eyebrow } from "./Primitives";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8">
      <div className="animate-rise max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function PageSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}
