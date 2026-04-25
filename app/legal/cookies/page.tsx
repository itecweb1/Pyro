import { LegalArticle } from "@/components/legal-article"

export const metadata = { title: "Cookies" }

export default function CookiesPage() {
  return (
    <LegalArticle
      eyebrow="Legal"
      title="Cookies."
      intro="We use the minimum number of cookies required to run the site. No advertising trackers, no cross-site profiling."
      sections={[
        {
          heading: "Strictly necessary",
          body: [
            "Supabase auth cookies — to keep you signed in.",
            "Session cookies — to remember your cart.",
          ],
        },
        {
          heading: "Analytics",
          body: [
            "Aggregate, anonymised page view data via Vercel Analytics. No IP addresses are stored, no profiles are built.",
          ],
        },
        {
          heading: "Control",
          body: [
            "You can clear cookies at any time through your browser settings. Clearing them will sign you out and empty your cart.",
          ],
        },
      ]}
    />
  )
}
