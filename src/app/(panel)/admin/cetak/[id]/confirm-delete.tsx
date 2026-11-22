"use client";

import type { ReactNode } from "react";

/** Form hapus dengan konfirmasi browser lebih dulu. */
export function ConfirmDelete({ action, label, children }: { action: () => Promise<void>; label: string; children: ReactNode }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Hapus ${label}? Tindakan ini tidak bisa dibatalkan.`)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
