type Section = {
  heading: string
  body: string[]
}

export function LegalArticle({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string
  title: string
  intro: string
  sections: Section[]
}) {
  return (
    <article className="max-w-2xl">
      <p className="label-eyebrow">{eyebrow}</p>
      <h1 className="mt-5 font-serif text-[44px] md:text-[64px] leading-[0.95] tracking-tight">
        {title}
      </h1>
      <p className="mt-6 text-[16px] leading-relaxed text-foreground/80 max-w-prose">
        {intro}
      </p>

      <div aria-hidden className="chrome-rule my-12" />

      <div className="flex flex-col gap-10">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="label-eyebrow">{s.heading}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className="text-[14.5px] leading-relaxed text-foreground/80"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
