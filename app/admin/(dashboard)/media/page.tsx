export const metadata = { title: "Admin medias" }

export default function AdminMediaPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="label-eyebrow">Assets</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Medias.
        </h1>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["/products/hero-main.jpg", "Hero campagne"],
          ["/products/hero-editorial.jpg", "Editorial"],
          ["/products/about-editorial.jpg", "Manifeste"],
        ].map(([src, label]) => (
          <article key={src} className="border border-border p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="aspect-[4/5] w-full object-cover" />
            <p className="mt-3 text-sm font-medium">{label}</p>
            <p className="mt-1 text-xs text-smoke">{src}</p>
          </article>
        ))}
      </section>
      <p className="max-w-2xl text-sm leading-relaxed text-smoke">
        Pour une v2 production, connecte Cloudinary ou Supabase Storage ici:
        upload signe cote serveur, transformation responsive, tags campagne et
        selection directe dans les formulaires produits.
      </p>
    </div>
  )
}
