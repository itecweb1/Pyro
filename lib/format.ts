export function formatPrice(
  cents: number,
  currency = "MAD",
  locale = "fr-MA",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function formatDate(iso: string, locale = "fr-MA") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(iso))
}
