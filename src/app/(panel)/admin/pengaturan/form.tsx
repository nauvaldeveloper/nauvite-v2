"use client";

import { useActionState } from "react";
import { Button, Field, Input, Notice } from "@/components/ui";
import { saveSettings, type SimpleState } from "@/lib/admin/actions";
import type { BusinessSettings } from "@/lib/admin/data";

export function SettingsForm({ initial }: { initial: BusinessSettings }) {
  const [state, action, pending] = useActionState<SimpleState, FormData>(saveSettings, {});
  const price = (id: string, name: keyof BusinessSettings, label: string) => (
    <Field label={label} htmlFor={id}>
      <Input id={id} name={name} type="number" min={0} step={1000} defaultValue={initial[name] as number} />
    </Field>
  );
  return (
    <form action={action} className="grid gap-5">
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      {state.ok ? <Notice tone="success">{state.ok}</Notice> : null}
      <Field label="Nama usaha" htmlFor="s-name">
        <Input id="s-name" name="businessName" defaultValue={initial.businessName} required />
      </Field>
      <Field label="Nomor WhatsApp admin" htmlFor="s-wa" hint="Dipakai tombol pesan dan konfirmasi pembayaran.">
        <Input id="s-wa" name="ownerWhatsapp" defaultValue={initial.ownerWhatsapp} inputMode="tel" required />
      </Field>
      <div>
        <p className="mb-3 text-[13px] font-semibold text-ink/80">Harga paket</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {price("s-basic", "priceDefault", "Basic (Rp)")}
          {price("s-premium", "pricePremium", "Premium (Rp)")}
        </div>
      </div>
      <div>
        <p className="mb-3 text-[13px] font-semibold text-ink/80">Paket Hemat (tema tanpa foto)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {price("s-hemat", "priceHemat", "Harga normal (Rp)")}
          {price("s-hemat-promo", "priceHematPromo", "Harga promo (Rp)")}
          <Field label="Promo sampai tanggal" htmlFor="s-hemat-until" hint="Setelah lewat, harga kembali normal sendiri. Kosongkan untuk mematikan promo.">
            <Input id="s-hemat-until" name="hematPromoUntil" type="date" defaultValue={initial.hematPromoUntil} />
          </Field>
        </div>
      </div>
      <div>
        <p className="mb-3 text-[13px] font-semibold text-ink/80">Harga mitra (WO, MUA, vendor)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {price("s-phemat", "pricePartnerHemat", "Mitra Hemat (Rp)")}
          {price("s-pbasic", "pricePartner", "Mitra Basic (Rp)")}
          {price("s-ppremium", "pricePartnerPremium", "Mitra Premium (Rp)")}
        </div>
      </div>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
