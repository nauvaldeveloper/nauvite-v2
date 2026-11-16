"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button, ButtonLink, Card, CardTitle, Field, Input, Notice, Select } from "@/components/ui";
import { CredentialsCard } from "@/components/panel/credentials";
import { createInvitation, type CreateInvitationState } from "@/lib/admin/actions";

const SITE_HOST = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/^https?:\/\//, "");

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

export function CreateInvitationForm({
  templates,
  partners,
}: {
  templates: { id: string; name: string; category: string }[];
  partners: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<CreateInvitationState, FormData>(createInvitation, {});
  const [groom, setGroom] = useState("");
  const [bride, setBride] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [createAccount, setCreateAccount] = useState(true);
  const [login, setLogin] = useState("");
  const [loginTouched, setLoginTouched] = useState(false);

  const autoSlug = slugTouched ? slug : toSlug([groom, bride].filter(Boolean).join(" "));
  const autoLogin = loginTouched ? login : autoSlug;
  const fe = state.fieldErrors ?? {};

  if (state.created) {
    const c = state.created;
    return (
      <div className="grid max-w-2xl gap-4">
        <Notice tone="success">
          Undangan <strong>/{c.slug}</strong> berhasil dibuat.
        </Notice>
        {c.credentials ? (
          <CredentialsCard
            login={c.credentials.login}
            password={c.credentials.password}
            whatsapp={c.credentials.whatsapp}
            slug={c.slug}
          />
        ) : null}
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/admin/undangan/${c.id}`}>Buka detail undangan</ButtonLink>
          <ButtonLink href="/admin/buat" variant="secondary" onClick={() => location.reload()}>
            Buat lagi
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid max-w-2xl gap-5">
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}

      <Card>
        <CardTitle>Undangan</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama panggilan pria" htmlFor="groomName">
            <Input id="groomName" name="groomName" value={groom} onChange={(e) => setGroom(e.target.value)} />
          </Field>
          <Field label="Nama panggilan wanita" htmlFor="brideName">
            <Input id="brideName" name="brideName" value={bride} onChange={(e) => setBride(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field
              label="Slug (alamat undangan)"
              htmlFor="slug"
              error={fe.slug}
              hint={
                <>
                  Undangan bisa dibuka di <strong>{SITE_HOST}/{autoSlug || "nama-pasangan"}</strong>. Huruf kecil, angka, dan
                  tanda minus.
                </>
              }
            >
              <Input
                id="slug"
                name="slug"
                value={autoSlug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(toSlug(e.target.value));
                }}
                required
              />
            </Field>
          </div>
          <Field label="Tema" htmlFor="templateId" error={fe.templateId}>
            <Select id="templateId" name="templateId" defaultValue="royal-gold">
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.category})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tanggal acara utama" htmlFor="weddingDate" hint="Boleh dikosongkan, bisa diisi klien nanti.">
            <Input id="weddingDate" name="weddingDate" type="date" />
          </Field>
          <Field label="Mitra" htmlFor="partnerId" hint="Isi kalau klien ini datang lewat WO/vendor mitra.">
            <Select id="partnerId" name="partnerId" defaultValue="">
              <option value="">Tanpa mitra</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status awal" htmlFor="activeDays" hint="Pilih draf kalau klien belum membayar.">
            <Select id="activeDays" name="activeDays" defaultValue="0">
              <option value="0">Draf (belum bisa dibuka tamu)</option>
              <option value="30">Aktif 30 hari</option>
              <option value="90">Aktif 90 hari</option>
              <option value="180">Aktif 6 bulan</option>
              <option value="365">Aktif 1 tahun</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card>
        <CardTitle>Akun klien</CardTitle>
        <label className="mb-4 flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="createAccount"
            checked={createAccount}
            onChange={(e) => setCreateAccount(e.target.checked)}
            className="mt-0.5 size-4 accent-[#1f3a2e]"
          />
          <span>
            Buatkan akun login untuk klien
            <span className="block text-[13px] text-[#5b655f]">
              Klien bisa masuk sendiri untuk mengisi data undangan dan melihat RSVP. Matikan kalau undangan diisi admin
              atau mitra saja.
            </span>
          </span>
        </label>
        {createAccount ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Username login"
              htmlFor="login"
              error={fe.login}
              hint="Bawaannya sama dengan slug. Bisa juga diisi email klien."
            >
              <Input
                id="login"
                name="login"
                value={autoLogin}
                autoCapitalize="none"
                onChange={(e) => {
                  setLoginTouched(true);
                  setLogin(e.target.value.toLowerCase());
                }}
              />
            </Field>
            <Field label="Nomor WhatsApp klien" htmlFor="whatsapp" hint="Untuk tombol kirim akun lewat WA.">
              <Input id="whatsapp" name="whatsapp" inputMode="tel" placeholder="08xxxxxxxxxx" />
            </Field>
          </div>
        ) : null}
        <p className="mt-4 text-[13px] text-[#5b655f]">
          Password dibuat otomatis dan ditampilkan sekali setelah disimpan.
        </p>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Buat undangan"}
        </Button>
        <Link href="/admin" className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-black/5">
          Batal
        </Link>
      </div>
    </form>
  );
}
