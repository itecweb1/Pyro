"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string }

type Props = {
  /** Server action that returns ActionResult. Plain `(formData)` signature. */
  action: (formData: FormData) => Promise<ActionResult | void>
  /** Toast message on success (overridden by server-returned `message`). */
  successMessage: string
  /** Form children — typically inputs and a `<SubmitButton />`. */
  children: React.ReactNode
  className?: string
}

/**
 * Wrap a `<form>` with this to surface success/error toasts from a server
 * action that returns `ActionResult`. Use inside lists / detail pages where
 * the action does NOT redirect (status update, stock update, toggle, etc.).
 */
export function FormToast({
  action,
  successMessage,
  children,
  className,
}: Props) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await action(formData)
      // void return = treat as success with no custom message
      if (!result) return { ok: true }
      return result
    },
    null,
  )

  useEffect(() => {
    if (!state) return
    if (state.ok) {
      toast.success(state.message ?? successMessage)
    } else {
      toast.error(state.error)
    }
  }, [state, successMessage])

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  )
}
