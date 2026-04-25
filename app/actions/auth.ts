"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"

export async function signOut() {
  if (!hasSupabaseEnv()) redirect("/")

  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function updateProfile(formData: FormData) {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Connecte Supabase pour modifier le profil." }
  }

  const firstName = String(formData.get("first_name") ?? "").trim()
  const lastName = String(formData.get("last_name") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )

  revalidatePath("/account")
  return { ok: true }
}
