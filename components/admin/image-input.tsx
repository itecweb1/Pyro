"use client"

import { useEffect, useRef, useState } from "react"
import { ImageOff, Upload, X } from "lucide-react"

type Props = {
  name: string
  label: string
  /** URL of an existing image to show as the initial preview. */
  currentUrl?: string | null
  /** Limit MIME types. Defaults to images. */
  accept?: string
  className?: string
}

/**
 * File input with live preview. Shows `currentUrl` until the user picks a
 * file, then swaps to a blob preview of the selected file. The chosen file
 * is submitted as the named field of the parent form.
 */
export function ImageInput({
  name,
  label,
  currentUrl,
  accept = "image/*",
  className,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const blobUrlRef = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Clean up the blob URL when it changes or on unmount.
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  function clearBlob() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    clearBlob()
    if (file) {
      const url = URL.createObjectURL(file)
      blobUrlRef.current = url
      setPreviewUrl(url)
      setPendingFile(file)
    } else {
      setPreviewUrl(currentUrl ?? null)
      setPendingFile(null)
    }
  }

  function clearSelection() {
    clearBlob()
    setPendingFile(null)
    setPreviewUrl(currentUrl ?? null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={`grid gap-2 ${className ?? ""}`}>
      <span className="label-eyebrow">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex size-20 items-center justify-center border border-border bg-secondary/30 overflow-hidden">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <ImageOff
              className="size-6 text-smoke/60"
              strokeWidth={1.2}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 border border-border bg-background px-3 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-secondary focus-within:ring-2 focus-within:ring-foreground/30 focus-within:ring-offset-1">
            <Upload className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            {pendingFile ? "Changer le fichier" : "Choisir un fichier"}
            <input
              ref={inputRef}
              type="file"
              name={name}
              accept={accept}
              onChange={handleChange}
              className="sr-only"
            />
          </label>
          {pendingFile && (
            <div className="flex items-center gap-2 text-xs text-smoke">
              <span className="truncate" title={pendingFile.name}>
                {pendingFile.name}
              </span>
              <span className="tabular-nums">
                {(pendingFile.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={clearSelection}
                aria-label="Annuler la sélection"
                className="inline-flex size-5 items-center justify-center text-smoke transition-colors hover:text-foreground"
              >
                <X className="size-3" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
