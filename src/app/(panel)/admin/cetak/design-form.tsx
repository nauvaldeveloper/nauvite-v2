"use client";

import { useActionState, useRef, useState } from "react";
import { Button, Field, Input, Notice, Select, Textarea } from "@/components/ui";
import { savePrintDesign, type PrintFormState } from "@/lib/print/actions";
import type { AdminPrintDesign } from "@/lib/print/admin";
import { compressImage } from "@/lib/invitation/upload";
import { PRINT_FOILS, PRINT_FORMATS, PRINT_TIERS, printImageUrl } from "@/lib/print/shared";
import { createClient } from "@/lib/supabase/client";

const rupiah = (n: number) => `Rp${new Intl.NumberFormat("id-ID").format(n)}`;

/** Form tambah/ubah desain cetak, termasuk unggah foto produk. */
export function PrintDesignForm({ design, nextCode }: { design?: AdminPrintDesign; nextCode?: string }) {
  const [state, action, pending] = useActionState<PrintFormState, FormData>(
    savePrintDesign.bind(null, design?.id ?? null),
    { status: "idle" },
  );
  const [images, setImages] = useState<string[]>(design?.images ?? []);
  const [price, setPrice] = useState(String(design?.price ?? ""));
  const [cost, setCost] = useState(design?.cost != null ? String(design.cost) : "");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const margin = price && cost ? Number(price) - Number(cost) : null;

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploadError(null);
    setBusy(true);
    const supabase = createClient();
    const added: string[] = [];
    for (const file of Array.from(files).slice(0, 8 - images.length)) {
      if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) {
        setUploadError("Pakai foto JPG, PNG, atau WebP.");
        continue;
      }
      let body: Blob = file;
      let ext = "webp";
      try {
        body = await compressImage(file, 1400, 0.84);
      } catch {
        ext = file.type === "image/png" ? "png" : "jpg";
      }
      const path = `designs/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("print-media")
        .upload(path, body, { contentType: ext === "webp" ? "image/webp" : file.type, cacheControl: "31536000" });
      if (error) setUploadError(`Gagal mengunggah: ${error.message}`);
      else added.push(path);
    }
    setImages((prev) => [...prev, ...added]);
    setBusy(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  const move = (i: number, to: number) =>
    setImages((prev) => {
      const next = [...prev];
      [next[i], next[to]] = [next[to], next[i]];
      return next;
    });

  return (
    <form action={action} className="grid gap-6">
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      {state.status === "ok" ? <Notice tone="success">{state.message}</Notice> : null}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink/80">Foto produk</p>
        <p className="mb-3 text-[13px] text-muted">
          Foto pertama jadi sampul di katalog. Foto asli (sampel di meja, cahaya siang) lebih dipercaya klien daripada
          gambar katalog vendor.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((src, i) => (
            <div key={src} className="overflow-hidden rounded-xl border border-line bg-[#ebe4d6]">
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={printImageUrl(src)} alt="" className="absolute inset-0 m-auto max-h-[90%] max-w-[90%] object-contain" />
              </div>
              <div className="flex items-center justify-between border-t border-line bg-card px-1.5 py-1 text-[12px]">
                <span className="px-1 font-semibold text-muted">{i === 0 ? "Sampul" : i + 1}</span>
                <span className="flex">
                  <button type="button" disabled={i === 0} onClick={() => move(i, i - 1)} className="rounded px-1.5 py-1 hover:bg-ink/5 disabled:opacity-30" aria-label="Geser ke kiri">
                    &larr;
                  </button>
                  <button
                    type="button"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, i + 1)}
                    className="rounded px-1.5 py-1 hover:bg-ink/5 disabled:opacity-30"
                    aria-label="Geser ke kanan"
                  >
                    &rarr;
                  </button>
                  <button type="button" onClick={() => setImages((p) => p.filter((x) => x !== src))} className="rounded px-1.5 py-1 text-red-700 hover:bg-red-50">
                    Hapus
                  </button>
                </span>
              </div>
            </div>
          ))}
          {images.length < 8 ? (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={busy}
              className="grid aspect-square place-items-center rounded-xl border border-dashed border-ink/25 text-[14px] font-semibold text-ink/70 hover:border-ink/50 hover:bg-white/50"
            >
              {busy ? "Mengunggah..." : "+ Tambah foto"}
            </button>
          ) : null}
        </div>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => upload(e.target.files)} />
        {uploadError ? <p className="mt-2 text-sm text-red-700">{uploadError}</p> : null}
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-[140px_1fr]">
        <Field label="Kode" htmlFor="d-code" hint="Dilihat klien.">
          <Input id="d-code" name="code" defaultValue={design?.code ?? nextCode} required maxLength={20} className="uppercase" />
        </Field>
        <Field label="Nama desain" htmlFor="d-name">
          <Input id="d-name" name="name" defaultValue={design?.name} required maxLength={60} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Kelas" htmlFor="d-tier">
          <Select id="d-tier" name="tier" defaultValue={design?.tier ?? "hemat"}>
            {Object.entries(PRINT_TIERS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Bentuk" htmlFor="d-format">
          <Select id="d-format" name="format" defaultValue={design?.format ?? "lipat"}>
            {Object.entries(PRINT_FORMATS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Foil" htmlFor="d-foil">
          <Select id="d-foil" name="foil" defaultValue={design?.foil ?? "none"}>
            {Object.entries(PRINT_FOILS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Arah gambar" htmlFor="d-orient">
          <Select id="d-orient" name="orientation" defaultValue={design?.orientation ?? "landscape"}>
            <option value="landscape">Melebar</option>
            <option value="portrait">Tegak</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 rounded-2xl bg-ink/[0.03] p-4 sm:grid-cols-3">
        <Field label="Harga jual per pcs (Rp)" htmlFor="d-price" hint="Sudah termasuk cetak nama dan isi.">
          <Input id="d-price" name="price" type="number" min={0} step={1} value={price} onChange={(e) => setPrice(e.target.value)} required />
        </Field>
        <Field label="Modal blangko (Rp)" htmlFor="d-cost" hint="Hanya terlihat admin.">
          <Input id="d-cost" name="cost" type="number" min={0} step={1} value={cost} onChange={(e) => setCost(e.target.value)} />
        </Field>
        <Field label="Kode vendor" htmlFor="d-vendor" hint={margin != null ? `Untung ${rupiah(margin)}/pcs sebelum tinta.` : "Hanya terlihat admin."}>
          <Input id="d-vendor" name="vendorCode" defaultValue={design?.vendorCode ?? ""} maxLength={40} />
        </Field>
      </div>

      <Field label="Keterangan (opsional)" htmlFor="d-note" hint="Mis. isi set: cover, amplop, dan board.">
        <Textarea id="d-note" name="note" rows={2} defaultValue={design?.note ?? ""} maxLength={300} />
      </Field>

      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <label className="flex items-center gap-2 text-[15px]">
          <input type="checkbox" name="active" defaultChecked={design?.active ?? true} className="size-4 accent-[#17261f]" />
          Tampil di katalog
        </label>
        <label className="flex items-center gap-2 text-[15px]">
          <input type="checkbox" name="featured" defaultChecked={design?.featured ?? false} className="size-4 accent-[#17261f]" />
          Tandai favorit (tampil paling depan)
        </label>
        <Field label="Urutan" htmlFor="d-sort">
          <Input id="d-sort" name="sort" type="number" min={0} max={9999} defaultValue={design?.sort ?? 0} className="w-28" />
        </Field>
      </div>

      <div>
        <Button type="submit" disabled={pending || busy}>
          {pending ? "Menyimpan..." : design ? "Simpan perubahan" : "Tambah desain"}
        </Button>
      </div>
    </form>
  );
}
