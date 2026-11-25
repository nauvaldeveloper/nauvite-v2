"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { Button, Field, Input, Select, Textarea, cx } from "@/components/ui";
import { PhonePreview } from "@/components/panel/phone-preview";
import { saveInvitationContent, type SaveState } from "@/lib/invitation/editor-actions";
import type { EditorEvent, EditorGift, EditorPayload, EditorPerson, EditorStory } from "@/lib/invitation/editor-schema";
import type { TemplateManifest } from "@/templates/manifest";
import { GalleryInput } from "./gallery-input";
import { MediaInput } from "./media-input";
import { TemplateFields } from "./template-fields";

const SECTIONS = [
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "sampul", label: "Sampul dan musik" },
  { id: "cerita", label: "Cerita" },
  { id: "galeri", label: "Galeri" },
  { id: "amplop", label: "Amplop digital" },
  { id: "tema", label: "Pengaturan tema" },
];

const EMPTY_EVENT: EditorEvent = { title: "", date: "", startTime: "08:00", endTime: "Selesai" };
const EMPTY_STORY: EditorStory = { title: "" };
const EMPTY_GIFT: EditorGift = { bank: "", accountNumber: "", accountName: "" };

export function InvitationEditor({
  invitationId,
  slug,
  manifest,
  initial,
}: {
  invitationId: string;
  slug: string;
  manifest: TemplateManifest;
  initial: EditorPayload;
}) {
  const [data, setData] = useState<EditorPayload>(initial);
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState<SaveState>({ status: "idle" });
  const [version, setVersion] = useState(0);
  const [saving, startSaving] = useTransition();

  // Ingatkan kalau menutup halaman sebelum menyimpan.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(patch: Partial<EditorPayload>) {
    setData((d) => ({ ...d, ...patch }));
    setDirty(true);
  }

  function save() {
    startSaving(async () => {
      const res = await saveInvitationContent(invitationId, data);
      setState(res);
      if (res.status === "ok") {
        setDirty(false);
        setVersion((v) => v + 1);
      }
    });
  }

  const setPerson = (role: "groom" | "bride", p: EditorPerson) =>
    update({ couple: { ...data.couple, [role]: p } as EditorPayload["couple"] });

  const withPhoto = manifest.withPhoto;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      {/* Menu bagian */}
      <nav className="sticky top-[57px] z-20 -mx-4 flex gap-1 overflow-x-auto border-b border-line bg-[#f3eee5]/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 xl:col-span-2 xl:mx-0 xl:rounded-full xl:border xl:bg-card xl:px-2">
        {SECTIONS.filter((s) => withPhoto || s.id !== "galeri").map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-muted hover:bg-ink/5 hover:text-ink"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="grid min-w-0 content-start gap-5">
        <Section id="mempelai" title="Mempelai" hint={
            withPhoto
              ? "Nama, orang tua, foto, dan akun media sosial."
              : "Nama, orang tua, dan akun media sosial. Tema ini tampil tanpa foto."
          }>
          <div className="grid gap-8 lg:grid-cols-2">
            <PersonForm role="groom" withPhoto={withPhoto} invitationId={invitationId} value={data.couple.groom} onChange={(p) => setPerson("groom", p)} />
            <PersonForm role="bride" withPhoto={withPhoto} invitationId={invitationId} value={data.couple.bride} onChange={(p) => setPerson("bride", p)} />
          </div>
        </Section>

        <Section id="acara" title="Acara" hint="Akad, resepsi, ngunduh mantu, dan lainnya. Hitung mundur mengikuti acara pertama.">
          <ListEditor
            items={data.events ?? []}
            onChange={(events) => update({ events })}
            empty={EMPTY_EVENT}
            addLabel="Tambah acara"
            max={6}
            render={(ev, set) => (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama acara">
                  <Input value={ev.title ?? ""} onChange={(e) => set({ ...ev, title: e.target.value })} placeholder="Akad Nikah" />
                </Field>
                <Field label="Tanggal">
                  <Input type="date" value={ev.date ?? ""} onChange={(e) => set({ ...ev, date: e.target.value })} />
                </Field>
                <Field label="Jam mulai">
                  <Input type="time" value={ev.startTime ?? ""} onChange={(e) => set({ ...ev, startTime: e.target.value })} />
                </Field>
                <Field label="Jam selesai" hint='Isi jam, atau tulis "Selesai".'>
                  <Input value={ev.endTime ?? ""} onChange={(e) => set({ ...ev, endTime: e.target.value })} placeholder="Selesai" />
                </Field>
                <Field label="Tempat">
                  <Input value={ev.location ?? ""} onChange={(e) => set({ ...ev, location: e.target.value })} placeholder="Gedung Serbaguna..." />
                </Field>
                <Field label="Link Google Maps" hint="Buka Google Maps, cari tempatnya, Bagikan, Salin link.">
                  <Input value={ev.mapsUrl ?? ""} onChange={(e) => set({ ...ev, mapsUrl: e.target.value })} placeholder="https://maps.app.goo.gl/..." />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Alamat lengkap">
                    <Textarea rows={2} value={ev.address ?? ""} onChange={(e) => set({ ...ev, address: e.target.value })} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Hiburan" hint="Opsional, mis. Live music akustik.">
                    <Input value={ev.entertainment ?? ""} onChange={(e) => set({ ...ev, entertainment: e.target.value })} />
                  </Field>
                </div>
              </div>
            )}
          />
        </Section>

        <Section
          id="sampul"
          title="Sampul dan musik"
          hint={withPhoto ? "Foto utama, lagu latar, video, dan kutipan pembuka." : "Lagu latar, video, dan kutipan pembuka."}
        >
          <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
            <Field
              label={withPhoto ? "Foto sampul" : "Gambar link WhatsApp"}
              hint={
                withPhoto
                  ? "Juga dipakai sebagai gambar saat link dibagikan di WhatsApp."
                  : "Opsional. Kalau kosong, gambarnya dibuat otomatis dari nama dan tanggal kalian."
              }
            >
              <MediaInput
                invitationId={invitationId}
                value={data.coverImage}
                onChange={(p) => update({ coverImage: p })}
                label={withPhoto ? "Foto sampul" : "Gambar link"}
              />
            </Field>
            <div className="grid content-start gap-5">
              <Field label="Lagu latar" hint="MP3, maksimal 10 MB. Diputar saat tamu membuka undangan.">
                <MediaInput invitationId={invitationId} value={data.music} kind="audio" label="Unggah lagu" onChange={(p) => update({ music: p })} />
              </Field>
              <Field label="Link video YouTube" hint="Opsional, mis. video prewedding.">
                <Input value={data.youtubeUrl ?? ""} onChange={(e) => update({ youtubeUrl: e.target.value })} placeholder="https://youtu.be/..." />
              </Field>
              <Field label="Kutipan" hint="Ayat, puisi, atau kalimat pembuka. Opsional.">
                <Textarea rows={3} value={data.quotes ?? ""} onChange={(e) => update({ quotes: e.target.value })} />
              </Field>
              <Field label="Sumber kutipan">
                <Input value={data.quotesSource ?? ""} onChange={(e) => update({ quotesSource: e.target.value })} placeholder="QS. Ar-Rum: 21" />
              </Field>
            </div>
          </div>
        </Section>

        <Section id="cerita" title="Cerita" hint="Perjalanan kalian, dari pertama bertemu sampai lamaran. Opsional.">
          <ListEditor
            items={data.stories ?? []}
            onChange={(stories) => update({ stories })}
            empty={EMPTY_STORY}
            addLabel="Tambah cerita"
            max={10}
            render={(st, set) => (
              <div className={withPhoto ? "grid gap-4 sm:grid-cols-[140px_1fr]" : "grid gap-4"}>
                {withPhoto ? (
                  <MediaInput invitationId={invitationId} value={st.image} onChange={(p) => set({ ...st, image: p })} aspect="aspect-[4/3]" label="Foto" />
                ) : null}
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Judul">
                      <Input value={st.title ?? ""} onChange={(e) => set({ ...st, title: e.target.value })} placeholder="Pertama bertemu" />
                    </Field>
                    <Field label="Waktu">
                      <Input value={st.date ?? ""} onChange={(e) => set({ ...st, date: e.target.value })} placeholder="Agustus 2021" />
                    </Field>
                  </div>
                  <Field label="Cerita">
                    <Textarea rows={3} value={st.description ?? ""} onChange={(e) => set({ ...st, description: e.target.value })} />
                  </Field>
                </div>
              </div>
            )}
          />
        </Section>

        {withPhoto ? (
          <Section id="galeri" title="Galeri" hint="Foto prewedding atau momen kalian.">
            <GalleryInput invitationId={invitationId} value={data.gallery ?? []} onChange={(gallery) => update({ gallery })} />
          </Section>
        ) : null}

        <Section id="amplop" title="Amplop digital" hint="Rekening atau dompet digital. Logo BCA, Mandiri, BNI, BRI, BSI, DANA, OVO, dan GoPay muncul otomatis.">
          <ListEditor
            items={data.gifts ?? []}
            onChange={(gifts) => update({ gifts })}
            empty={EMPTY_GIFT}
            addLabel="Tambah rekening"
            max={5}
            render={(g, set) => (
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Bank / dompet digital">
                  <Input value={g.bank ?? ""} onChange={(e) => set({ ...g, bank: e.target.value })} placeholder="BCA" />
                </Field>
                <Field label="Nomor rekening">
                  <Input inputMode="numeric" value={g.accountNumber ?? ""} onChange={(e) => set({ ...g, accountNumber: e.target.value })} />
                </Field>
                <Field label="Atas nama">
                  <Input value={g.accountName ?? ""} onChange={(e) => set({ ...g, accountName: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </Section>

        <Section id="tema" title={`Pengaturan tema ${manifest.name}`} hint="Pengaturan khusus tema ini. Kalau dikosongkan, tema memakai pilihan bawaannya.">
          <TemplateFields
            manifest={manifest}
            invitationId={invitationId}
            values={(data.templateOptions as Record<string, unknown>) ?? {}}
            onChange={(templateOptions) => update({ templateOptions })}
            errors={state.status === "error" ? state.fieldErrors : undefined}
          />
        </Section>
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-20 grid gap-4">
          <PhonePreview invitationId={invitationId} key={version} />
          <p className="text-center text-[12px] text-muted">Pratinjau diperbarui setiap kali disimpan.</p>
        </div>
      </aside>

      {/* Bilah simpan, selalu terlihat */}
      <div className="fixed inset-x-0 bottom-[60px] z-30 px-3 pb-3 lg:bottom-0 lg:left-[256px]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-[#f3eee5] shadow-[0_20px_40px_-15px_rgb(23_38_31/0.6)]">
          <p className="min-w-0 flex-1 truncate text-[13px]">
            {saving
              ? "Menyimpan..."
              : state.status === "error"
                ? <span className="text-[#f2b8ae]">{state.message}</span>
                : dirty
                  ? "Ada perubahan yang belum disimpan."
                  : state.status === "ok"
                    ? `Tersimpan pukul ${new Date(state.savedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}.`
                    : "Belum ada perubahan."}
          </p>
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full px-3 py-2 text-[13px] font-semibold text-[#c9d2cc] hover:text-white sm:block"
          >
            Lihat undangan
          </a>
          <Button variant="brass" onClick={save} disabled={saving || !dirty}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ id, title, hint, children }: { id: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-2xl border border-line bg-card p-5 sm:p-6 lg:scroll-mt-20">
      <h2 className="font-display text-2xl font-medium tracking-tight">{title}</h2>
      {hint ? <p className="mb-6 mt-1 text-[14px] text-muted">{hint}</p> : <div className="mb-6" />}
      {children}
    </section>
  );
}

function PersonForm({
  role,
  invitationId,
  withPhoto,
  value,
  onChange,
}: {
  role: "groom" | "bride";
  withPhoto: boolean;
  invitationId: string;
  value: EditorPerson;
  onChange: (p: EditorPerson) => void;
}) {
  const set = (patch: Partial<EditorPerson>) => onChange({ ...value, ...patch });
  const isGroom = role === "groom";
  return (
    <div className="grid content-start gap-4">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-brass">
        {isGroom ? "Mempelai pria" : "Mempelai wanita"}
      </p>
      <div className={withPhoto ? "grid grid-cols-[110px_1fr] gap-4" : "grid gap-4"}>
        {withPhoto ? (
          <MediaInput invitationId={invitationId} value={value.image} onChange={(p) => set({ image: p })} label="Foto" />
        ) : null}
        <div className="grid content-start gap-4">
          <Field label="Nama panggilan">
            <Input value={value.name ?? ""} onChange={(e) => set({ name: e.target.value })} placeholder={isGroom ? "Dimas" : "Laras"} />
          </Field>
          <Field label="Nama lengkap">
            <Input value={value.fullname ?? ""} onChange={(e) => set({ fullname: e.target.value })} />
          </Field>
        </div>
      </div>
      <Field label="Keterangan anak" hint={`mis. "${isGroom ? "Putra" : "Putri"} kedua dari"`}>
        <Input
          value={value.parentPrefix ?? ""}
          onChange={(e) => set({ parentPrefix: e.target.value })}
          placeholder={isGroom ? "Putra dari" : "Putri dari"}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama ayah">
          <Input value={value.father ?? ""} onChange={(e) => set({ father: e.target.value })} placeholder="Bapak ..." />
        </Field>
        <Field label="Nama ibu">
          <Input value={value.mother ?? ""} onChange={(e) => set({ mother: e.target.value })} placeholder="Ibu ..." />
        </Field>
      </div>
      <Field label="Media sosial" hint="Opsional.">
        <div className="grid grid-cols-[120px_1fr] gap-2">
          <Select value={value.socialKind ?? "instagram"} onChange={(e) => set({ socialKind: e.target.value as EditorPerson["socialKind"] })}>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="whatsapp">WhatsApp</option>
          </Select>
          <Input
            value={value.socialHandle ?? ""}
            onChange={(e) => set({ socialHandle: e.target.value.replace(/^@/, "") })}
            placeholder={value.socialKind === "whatsapp" ? "08xxxx" : "namaakun"}
          />
        </div>
      </Field>
    </div>
  );
}

/** Daftar isian berulang (acara, cerita, rekening): tambah, hapus, geser urutan. */
function ListEditor<T>({
  items,
  onChange,
  empty,
  addLabel,
  max,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  addLabel: string;
  max: number;
  render: (item: T, set: (item: T) => void) => ReactNode;
}) {
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="grid gap-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-line bg-white/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="grid size-7 place-items-center rounded-full bg-ink text-[12px] font-bold text-[#f3eee5]">{i + 1}</span>
            <div className="flex gap-1">
              <SmallButton onClick={() => move(i, -1)} disabled={i === 0} label="Naikkan">&uarr;</SmallButton>
              <SmallButton onClick={() => move(i, 1)} disabled={i === items.length - 1} label="Turunkan">&darr;</SmallButton>
              <SmallButton
                onClick={() => {
                  if (confirm("Hapus bagian ini?")) onChange(items.filter((_, k) => k !== i));
                }}
                label="Hapus"
                danger
              >
                Hapus
              </SmallButton>
            </div>
          </div>
          {render(item, (next) => onChange(items.map((x, k) => (k === i ? next : x))))}
        </div>
      ))}
      {items.length < max ? (
        <button
          type="button"
          onClick={() => onChange([...items, { ...empty }])}
          className="rounded-2xl border border-dashed border-ink/25 py-4 text-sm font-semibold text-muted hover:border-brass hover:text-brass"
        >
          + {addLabel}
        </button>
      ) : null}
    </div>
  );
}

function SmallButton({
  onClick,
  disabled,
  label,
  danger,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cx(
        "min-w-8 rounded-full px-2.5 py-1 text-[13px] font-semibold disabled:opacity-30",
        danger ? "text-red-700 hover:bg-red-50" : "text-muted hover:bg-ink/5",
      )}
    >
      {children}
    </button>
  );
}
