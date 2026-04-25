import Script from "next/script"
import type { Metadata } from "next"
import { Archivo, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { brand } from "@/lib/content"
import "./globals.css"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Pyro Wear - Streetwear homme premium",
    template: "%s — Pyro Wear",
  },
  description:
    "Pyro Wear cree des pieces streetwear homme premium: coupes affirmees, matieres lourdes, palette graphite, noir profond et chrome fume.",
  metadataBase: new URL(brand.siteUrl),
  openGraph: {
    title: "Pyro Wear - Streetwear homme premium",
    description:
      "Silhouettes urbaines premium. Noir profond, graphite, chrome fume.",
    type: "website",
    siteName: "Pyro Wear",
    locale: "fr_FR",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
}

export const viewport = {
  themeColor: "#0e0e10",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${instrumentSerif.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        <Toaster position="bottom-right" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
