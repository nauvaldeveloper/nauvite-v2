"use client";

import { useActionState, useState, useTransition } from "react";
import { Button, Field, Input, Notice, Select, Textarea } from "@/components/ui";
import { CredentialsCard } from "@/components/panel/credentials";
import {
  createOwnerAccount,
  resetPassword,
  updateInvitationMeta,
  type AccountState,
  type SimpleState,
} from "@/lib/admin/actions";

export function MetaForm({
  invitationId,
  initial,
  templates,
  partners,
}: {
  invitationId: string;
  initial: { slug: string; templateId: string; partnerId: string; adminNote: string };
  templates: { id: string; name: string; category: string }[];
  partners: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<SimpleState, FormData>(
    updateInvitationMeta.bind(null, invitationId),
    {},
  );

  return (
    <form action={action} className="grid gap-4">
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      {state.ok ? <Notice tone="success">{state.ok}</Notice> : null}
      <Field
        label="Slug"
        htmlFor="meta-slug"
        hint="Hati-hati: mengganti slug membuat link lama yang sudah disebar tidak bisa dibuka."
      >
        <Input id="meta-slug" name="slug" defaultValue={initial.slug} required />
      </Field>
      <Field label="Tema" htmlFor="meta-template">
        <Select id="meta-template" name="templateId" defaultValue={initial.templateId}>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.category})
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Mitra" htmlFor="meta-partner">
        <Select id="meta-partner" name="partnerId" defaultValue={initial.partnerId}>
          <option value="">Tanpa mitra</option>
          {partners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Catatan admin" htmlFor="meta-note" hint="Hanya terlihat admin, mis. catatan pembayaran.">
        <Textarea id="meta-note" name="adminNote" rows={3} defaultValue={initial.adminNote} />
      </Field>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}

export function AccountPanel({
  invitationId,
  slug,
  owner,
}: {
  invitationId: string;
  slug: string;
  owner: { id: string; login: string; whatsapp: string | null; lastSignIn: string | null } | null;
}) {
  const [createState, createAction, creating] = useActionState<AccountState, FormData>(
    createOwnerAccount.bind(null, invitationId),
    {},
  );
  const [resetState, setResetState] = useState<AccountState>({});
  const [resetting, startReset] = useTransition();

  const credentials = createState.credentials ?? resetState.credentials;

  if (credentials) {
    return (
      <CredentialsCard
        login={credentials.login}
        password={credentials.password}
        whatsapp={credentials.whatsapp}
        slug={slug}
        title={resetState.credentials ? "Password baru sudah dibuat" : "Akun login sudah dibuat"}
      />
    );
  }

  if (owner) {
    return (
      <div className="grid gap-4">
        {resetState.error ? <Notice tone="error">{resetState.error}</Notice> : null}
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-[#5b655f]">Username</dt>
          <dd className="font-medium">{owner.login}</dd>
          <dt className="text-[#5b655f]">WhatsApp</dt>
          <dd>{owner.whatsapp ?? "-"}</dd>
          <dt className="text-[#5b655f]">Terakhir masuk</dt>
          <dd>
            {owner.lastSignIn
              ? new Date(owner.lastSignIn).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
              : "Belum pernah"}
          </dd>
        </dl>
        <div>
          <Button
            variant="secondary"
            disabled={resetting}
            onClick={() => {
              if (!confirm("Buat password baru? Password lama tidak bisa dipakai lagi.")) return;
              startReset(async () => setResetState(await resetPassword(owner.id, owner.login, owner.whatsapp)));
            }}
          >
            {resetting ? "Membuat..." : "Buat password baru"}
          </Button>
          <p className="mt-2 text-[13px] text-[#5b655f]">Pakai ini kalau klien lupa password.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={createAction} className="grid gap-4">
      <p className="text-sm text-[#3d4741]">Undangan ini belum punya akun klien.</p>
      {createState.error ? <Notice tone="error">{createState.error}</Notice> : null}
      <Field label="Username login" htmlFor="acc-login" hint="Bawaannya sama dengan slug. Bisa juga email klien.">
        <Input id="acc-login" name="login" defaultValue={slug} autoCapitalize="none" />
      </Field>
      <Field label="Nomor WhatsApp klien" htmlFor="acc-wa">
        <Input id="acc-wa" name="whatsapp" inputMode="tel" placeholder="08xxxxxxxxxx" />
      </Field>
      <div>
        <Button type="submit" disabled={creating}>
          {creating ? "Membuat..." : "Buat akun klien"}
        </Button>
      </div>
    </form>
  );
}
