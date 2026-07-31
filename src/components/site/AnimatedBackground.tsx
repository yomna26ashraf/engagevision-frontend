export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-70" />
      <div className="absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_20%,black,transparent)]" />
      <div className="animate-float-slow absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-primary/25 blur-[120px]" />
      <div className="animate-float absolute -right-24 top-40 h-[22rem] w-[22rem] rounded-full bg-accent/25 blur-[120px]" />
      <div className="animate-pulse-glow absolute bottom-0 left-1/3 h-[20rem] w-[20rem] rounded-full bg-cyan/15 blur-[130px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-60" />
    </div>
  );
}
