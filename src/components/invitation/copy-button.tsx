"use client";

import { useState } from "react";

export function CopyButton({
  value,
  className,
  label = "Salin nomor",
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Browser lama: biarkan tamu menyalin manual.
    }
  }

  return (
    <button type="button" onClick={copy} className={className} aria-live="polite">
      {copied ? "Tersalin" : label}
    </button>
  );
}
