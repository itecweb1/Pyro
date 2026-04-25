"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ActionResult =
  | { ok: true }
  | { ok: false; error: string }
  | void
  | undefined

type Props = {
  /** Server action to call. Should return ActionResult. */
  action: (formData: FormData) => Promise<ActionResult>
  /** Hidden form fields to send (typically the entity id). */
  hidden: { name: string; value: string }[]
  /** Toast on success (e.g. "Catégorie supprimée"). */
  successMessage: string
  /** Dialog title — defaults to "Confirmer la suppression". */
  title?: string
  /** Dialog body. Be specific (mention the item by name). */
  description?: string
  /** Trigger button label (defaults "Supprimer"). */
  triggerLabel?: string
  /** Smaller / inline-friendly variant. Defaults to compact. */
  size?: "compact" | "block"
  /** Show only the icon on the trigger. */
  iconOnly?: boolean
  /** Path to navigate to after successful delete (e.g. back to list). */
  redirectTo?: string
}

const TRIGGER_BASE =
  "border border-red-200 text-[11px] uppercase tracking-[0.22em] text-red-700 transition-colors hover:bg-red-50 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"

export function ConfirmDeleteForm({
  action,
  hidden,
  successMessage,
  title = "Confirmer la suppression",
  description = "Cette action est irréversible.",
  triggerLabel = "Supprimer",
  size = "compact",
  iconOnly = false,
  redirectTo,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const formData = new FormData()
      for (const { name, value } of hidden) formData.set(name, value)
      const result = await action(formData)
      if (
        result &&
        typeof result === "object" &&
        "ok" in result &&
        result.ok === false
      ) {
        toast.error(result.error || "Une erreur s'est produite")
        return
      }
      toast.success(successMessage)
      setOpen(false)
      if (redirectTo) router.push(redirectTo)
    })
  }

  const triggerSize =
    size === "block"
      ? "w-full px-4 py-3"
      : "px-3 py-2"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={iconOnly ? triggerLabel : undefined}
        className={`${TRIGGER_BASE} ${triggerSize} ${iconOnly ? "inline-flex items-center justify-center" : "inline-flex items-center gap-2"}`}
      >
        <Trash2 className="size-3.5" strokeWidth={1.5} />
        {!iconOnly && <span>{triggerLabel}</span>}
      </button>
      <DialogContent className="font-sans">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription className="text-sm text-smoke">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={pending}
            className="border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="bg-red-600 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-white hover:bg-red-700 disabled:opacity-50"
          >
            {pending ? "Suppression…" : "Supprimer"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
