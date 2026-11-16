"use client";

import { useActionState } from "react";
import { Button, Field, Input, Notice } from "@/components/ui";
import { CredentialsCard } from "@/components/panel/credentials";
import { createPartner, type PartnerState } from "@/lib/admin/actions";

export function PartnerForm() {
  const [state, action, pending] = useActionState<PartnerState, FormData>(createPartner, {});

  if (state.credentials) {
    return (
      <div className="grid gap-3">
        <CredentialsCard
          title={`Akun mitra ${state.credentials.businessName} sudah dibuat`}
          login={state.credentials.login}
          password={state.credentials.password}
          whatsapp={state.credentials.whatsapp}
        />
        <Button variant="secondary" onClick={() => location.reload()}>
          Tambah mitra lain
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      <Field label="Nama usaha" htmlFor="p-name" hint='Tampil di undangan: "Dipersembahkan oleh ..."'>
        <Input id="p-name" name="businessName" required placeholder="mis. Sahabat Wedding" />
      </Field>
      <Field label="Link Instagram atau website" htmlFor="p-url">
        <Input id="p-url" name="businessUrl" type="url" placeholder="https://instagram.com/..." />
      </Field>
      <Field label="Nama pemilik" htmlFor="p-owner">
        <Input id="p-owner" name="fullName" />
      </Field>
      <Field label="Username login" htmlFor="p-login" hint="Bisa juga email mitra.">
        <Input id="p-login" name="login" required autoCapitalize="none" placeholder="mis. sahabatwedding" />
      </Field>
      <Field label="Nomor WhatsApp" htmlFor="p-wa">
        <Input id="p-wa" name="whatsapp" inputMode="tel" placeholder="08xxxxxxxxxx" />
      </Field>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Membuat..." : "Buat akun mitra"}
        </Button>
      </div>
    </form>
  );
}
