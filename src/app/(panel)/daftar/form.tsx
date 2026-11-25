"use client";

import { useActionState, useState } from "react";
import { Button, ButtonLink, Field, Input, Notice, Select } from "@/components/ui";
import { startTrial, type TrialState } from "@/lib/trial/actions";

export type TrialTheme = { slug: string; label: string; photo: boolean };

export function TrialForm({
  themes,
  initial,
}: {
  themes: TrialTheme[];
  initial: { demo: string; groom: string; bride: string; date: string };
}) {
  const [state, action, pending] = useActionState<TrialState, FormData>(startTrial, {});
  const [v, setV] = useState({ ...initial, whatsapp: "", password: "" });
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }));
  const err = state.fieldErrors ?? {};

  if (state.created) {
    return (
      <div className="mt-8 grid gap-5">
        <Notice tone="success">Akun jadi. Undangan kalian bisa dilihat selama 24 jam.</Notice>
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="text-[13px] font-semibold text-muted">Username untuk masuk lagi</p>
          <p className="mt-1 break-all font-display text-2xl font-medium">{state.created.login}</p>
          <p className="mt-2 text-[14px] text-muted">Passwordnya yang barusan kalian buat. Simpan keduanya ya.</p>
        </div>
        <ButtonLink href={`/editor/${state.created.id}`}>Mulai isi undangan</ButtonLink>
        <ButtonLink href="/dasbor" variant="secondary">
          Ke dasbor
        </ButtonLink>
      </div>
    );
  }

  return (
    <form action={action} className="mt-8 grid gap-4">
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mempelai pria" htmlFor="groom" error={err.groom}>
          <Input id="groom" name="groom" value={v.groom} onChange={set("groom")} maxLength={40} placeholder="Nama panggilan" required />
        </Field>
        <Field label="Mempelai wanita" htmlFor="bride" error={err.bride}>
          <Input id="bride" name="bride" value={v.bride} onChange={set("bride")} maxLength={40} placeholder="Nama panggilan" required />
        </Field>
      </div>
      <Field label="Tema" htmlFor="demo" error={err.demo}>
        <Select id="demo" name="demo" value={v.demo} onChange={set("demo")}>
          {[false, true].map((photo) => (
            <optgroup key={String(photo)} label={photo ? "Dengan foto" : "Tanpa foto"}>
              {themes
                .filter((t) => t.photo === photo)
                .map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.label}
                  </option>
                ))}
            </optgroup>
          ))}
        </Select>
      </Field>
      <Field label="Tanggal acara" htmlFor="date" hint="Boleh dikosongkan kalau belum pasti.">
        <Input id="date" name="date" type="date" value={v.date} onChange={set("date")} />
      </Field>
      <Field label="Nomor WhatsApp" htmlFor="whatsapp" error={err.whatsapp} hint="Untuk menghubungi kalian soal undangan ini.">
        <Input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" value={v.whatsapp} onChange={set("whatsapp")} placeholder="0812 3456 7890" required />
      </Field>
      <Field label="Buat password" htmlFor="password" error={err.password} hint="Minimal 8 huruf atau angka.">
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} value={v.password} onChange={set("password")} required />
      </Field>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Membuat undangan..." : "Buat undangan"}
      </Button>
    </form>
  );
}
