type AnnouncementBarProps = {
  items: string[]
}

export function AnnouncementBar({ items }: AnnouncementBarProps) {
  return (
    <div
      aria-label="Store announcements"
      className="relative border-b border-border bg-foreground text-background"
    >
      <div className="flex overflow-hidden">
        <ul className="animate-[marquee_38s_linear_infinite] flex shrink-0 items-center gap-12 py-2.5 pr-12 whitespace-nowrap">
          {[...items, ...items].map((t, i) => (
            <li
              key={i}
              className="text-[10.5px] uppercase tracking-[0.28em] font-medium"
            >
              {t}
              <span aria-hidden className="ml-12 text-smoke">/</span>
            </li>
          ))}
        </ul>
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}
