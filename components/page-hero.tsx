export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="container-page pb-10 pt-20 text-center">
      <span className="text-xs font-black uppercase tracking-[.25em] text-[#62d6ff]">{eyebrow}</span>
      <h1 className="text-gradient mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#98a7bc] md:text-lg">{description}</p>
    </section>
  );
}
