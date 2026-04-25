import Stripe from "stripe"

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null

  return new Stripe(key, {
    apiVersion: "2026-03-25.dahlia",
  })
}
