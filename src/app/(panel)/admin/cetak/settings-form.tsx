"use client";

import { useActionState } from "react";
import { Button, Field, Input, Notice } from "@/components/ui";
import { savePrintSettings, type PrintFormState } from "@/lib/print/actions";
import type { PrintSettings } from "@/lib/print/shared";

export function PrintSettingsForm({ initial }: { initial: PrintSettings }) {
  const [state, action, pending] = useActionState<PrintFormState, FormData>(savePrintSettings, { status: "idle" });
  return (
    <form action={action} className="grid gap-4">
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      {state.status === "ok" ? <Notice tone="success">{state.message}</Notice> : null}
      <Field label="Minimal pesanan (pcs)" htmlFor="p-min">
        <Input id="p-min" name="minOrder" type="number" min={1} step={1} defaultValue={initial.minOrder} required />
      </Field>
      <Field label="Lama produksi (hari kerja)" htmlFor="p-lead" hint='Contoh: "3-7" atau "5".'>
        <Input id="p-lead" name="leadDays" defaultValue={initial.leadDays} maxLength={20} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Plastik (Rp/pcs)" htmlFor="p-plastic">
          <Input id="p-plastic" name="plastic" type="number" min={0} step={1} defaultValue={initial.plastic} required />
        </Field>
        <Field label="Label nama (Rp/pcs)" htmlFor="p-label">
          <Input id="p-label" name="label" type="number" min={0} step={1} defaultValue={initial.label} required />
        </Field>
      </div>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
