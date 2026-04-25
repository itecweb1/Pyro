export function AdminSetupNotice() {
  return (
    <div className="border border-dashed border-border bg-secondary/30 p-6 text-[13px] leading-relaxed text-smoke">
      <p className="font-medium text-foreground">Configuration admin requise.</p>
      <p className="mt-2">
        Ajoute <code>SUPABASE_SERVICE_ROLE_KEY</code> pour permettre au dashboard
        de lire et modifier toutes les ressources, puis ajoute ton email dans{" "}
        <code>ADMIN_EMAILS</code> ou passe ton profil en role <code>admin</code>.
      </p>
    </div>
  )
}
