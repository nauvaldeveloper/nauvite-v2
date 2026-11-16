"use client";

import { useActionState, useState, useTransition } from "react";
import { Button, Field, Input, Notice } from "@/components/ui";
import { CredentialsCard } from "@/components/panel/credentials";
import { createPartner, resetPassword, type AccountState, type PartnerState } from "@/lib/admin/actions";

/** Tombol "Buat password baru" di tabel mitra. Password tidak pernah bisa dilihat ulang, jadi caranya dibuat baru. */
export function PartnerResetPassword({
  partnerId,
  login,
  whatsapp,
  businessName,
}: {
  partnerId: string;
  login: string | null;
  whatsapp: string | null;
  businessName: string | null;
}) {
  const [state, setState] = useState<AccountState>({});
  const [pending, start] = useTransition();

  if (!login) return <span className="text-[#5b655f]">-</span>;

  return (
    <div>
      <span>{login}</span>
      <button
        type="button"
        disabled={pending}
        className="mt-1 block text-[13px] font-medium text-[#96711f] hover:underline disabled:opacity-60"
        onClick={() => {
          if (!confirm(`Buat password baru untuk ${businessName ?? "mitra ini"}? Password lama tidak bisa dipakai lagi.`)) return;
          start(async () => setState(await resetPassword(partnerId, login, whatsapp)));
        }}
      >
        {pending ? "Membuat..." : "Buat password baru"}
      </button>
      {state.error ? (
        <div className="mt-2">
          <Notice tone="error">{state.error}</Notice>
        </div>
      ) : null}
      {state.credentials ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#17261f]/50 p-4" role="dialog" aria-modal="true">
          <div className="grid w-full max-w-md gap-3 rounded-2xl bg-[#fffdf8] p-5 shadow-xl">
            <CredentialsCard
              title={`Password baru ${businessName ?? "mitra"}`}
              login={state.credentials.login}
              password={state.credentials.password}
              whatsapp={state.credentials.whatsapp}
            />
            <Button variant="secondary" onClick={() => setState({})}>
              Tutup
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

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
