import type { LucideIcon } from "lucide-react"
import { Flame, PackageCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react"
import type { BrandSettings, HeroBanner } from "@/lib/types"

export const defaultBrandSettings: BrandSettings = {
  name: "Pyro Wear",
  slogan: "La coupe froide. Casablanca en mouvement.",
  description:
    "Streetwear homme premium pense pour le marche marocain, avec paiement comptant a la livraison, silhouettes affirmees et palette graphite.",
  shipping_threshold_cents: 100000,
  shipping_fee_cents: 3500,
  announcement_items: [
    "PAIEMENT A LA LIVRAISON PARTOUT AU MAROC",
    "LIVRAISON 24H CASA / 24-48H AUTRES VILLES",
    "CONFIRMATION PAR TELEPHONE AVANT EXPEDITION",
    "ECHANGE TAILLE SOUS 7 JOURS",
  ],
  hero_stats: [
    { label: "Paiement", value: "A la livraison" },
    { label: "Livraison", value: "24-48h" },
    { label: "Marche", value: "Maroc" },
  ],
}

export const defaultHeroBanners: HeroBanner[] = [
  {
    id: "hero-graphite-division",
    title: "Silhouette noire. Paiement a la livraison.",
    subtitle:
      "Capsules streetwear premium pour le Maroc, confirmees par telephone et livrees rapidement a Casablanca, Rabat, Marrakech, Tanger et partout ailleurs.",
    eyebrow: "Capsule Casablanca - Paiement COD",
    cta_label: "Commander maintenant",
    cta_href: "/shop",
    image_url: "/products/hero-main.jpg",
    is_active: true,
    sort_order: 1,
  },
]

export const brand = {
  name: defaultBrandSettings.name,
  slogan: defaultBrandSettings.slogan,
  description: defaultBrandSettings.description,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pyrowear.example",
}

export const mainNav = [
  { href: "/shop", label: "Boutique" },
  { href: "/nouveautes", label: "Nouveautes" },
  { href: "/best-sellers", label: "Best sellers" },
  { href: "/collections/tops", label: "Tops" },
  { href: "/collections/bottoms", label: "Bas" },
  { href: "/about", label: "Manifeste" },
]

export const assuranceItems: {
  icon: LucideIcon
  title: string
  copy: string
}[] = [
  {
    icon: Truck,
    title: "Livraison offerte des 1000 MAD",
    copy: "24h sur Casablanca, 24 a 48h sur la plupart des autres villes du Maroc.",
  },
  {
    icon: RotateCcw,
    title: "Echange taille sous 7 jours",
    copy: "Retour encadre par le service client pour garder un flux simple et rapide.",
  },
  {
    icon: ShieldCheck,
    title: "Paiement comptant a la livraison",
    copy: "La commande est confirmee avant expedition. Paiement au moment de la reception.",
  },
]

export const homepageCampaigns = [
  {
    title: "Graphite Division",
    copy: "Sweats lourds, cargos techniques et coupes boxy pour l'uniforme urbain.",
    href: "/collections/tops",
    image: "/products/graphite-hoodie.jpg",
  },
  {
    title: "Chrome Utility",
    copy: "Accessoires noirs, metal froid, details discrets et fonctionnels.",
    href: "/collections/accessories",
    image: "/products/onyx-bag.jpg",
  },
  {
    title: "Outer Shell",
    copy: "Couches exterieures sobres, coupe nette, presence immediate.",
    href: "/collections/outerwear",
    image: "/products/carbon-shell.jpg",
  },
]

export const faqItems = [
  {
    q: "Quelle taille choisir ?",
    a: "Pyro Wear taille legerement oversize. Prends ta taille habituelle pour une silhouette streetwear nette, ou une taille en dessous pour un porte plus ajuste.",
  },
  {
    q: "Quand ma commande est-elle expediee ?",
    a: "Les commandes sont confirmees rapidement puis expediees en 24h sur Casablanca et en 24 a 48h sur la plupart des autres villes du Maroc.",
  },
  {
    q: "Puis-je retourner un article ?",
    a: "Oui, tu peux demander un echange ou un retour sous 7 jours apres reception. Les pieces doivent etre non portees, avec etiquettes et emballage d'origine.",
  },
  {
    q: "Les stocks sont-ils limites ?",
    a: "Oui. Pyro Wear fonctionne par capsules courtes pour eviter la surproduction. Quand une taille part, le reassort n'est pas automatique.",
  },
  {
    q: "Comment fonctionne le paiement a la livraison ?",
    a: "Tu passes commande en ligne, l'equipe confirme les details par telephone si besoin, puis tu regles comptant au moment de la livraison.",
  },
]

export const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/customers", label: "Clients" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/media", label: "Medias" },
  { href: "/admin/settings", label: "Parametres" },
]

export const adminKpis = [
  { icon: Flame, label: "Marche prioritaire", value: "Maroc" },
  { icon: PackageCheck, label: "Mode paiement", value: "COD" },
]
