import { LegalArticle } from "@/components/legal-article"

export const metadata = { title: "Privacy" }

export default function PrivacyPage() {
  return (
    <LegalArticle
      eyebrow="Legal"
      title="Privacy."
      intro="This policy explains what data we collect, why we collect it, and how you can control it. Short version: we collect as little as possible."
      sections={[
        {
          heading: "What we collect",
          body: [
            "Account data: name, email, shipping address — only what you give us when you create an account or place an order.",
            "Order data: the pieces you buy and the address we ship to.",
            "Technical data: anonymised page views and errors, to improve the site.",
          ],
        },
        {
          heading: "What we don't do",
          body: [
            "We don't sell your data to third parties. Ever.",
            "We don't use cross-site advertising cookies. The site works without any tracking.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "Under GDPR you can request access, rectification, deletion, or portability of your data. Email privacy@pyrowear.example and we'll respond within 30 days.",
          ],
        },
      ]}
    />
  )
}
