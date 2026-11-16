"use client";

import { useRef, useState } from "react";
import { mediaUrl } from "@/lib/invitation/format";
import { ACCEPT, uploadInvitationFile } from "@/lib/invitation/upload";

/** Galeri: unggah banyak foto sekaligus, geser urutan, hapus. */
export function GalleryInput({
  invitationId,
  value,
  onChange,
  max = 24,
}: {
  invitationId: string;
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const list = Array.from(files).slice(0, max - value.length);
    const added: string[] = [];
    for (let i = 0; i < list.length; i++) {
      setProgress(`Mengunggah ${i + 1} dari ${list.length}...`);
      const res = await uploadInvitationFile(invitationId, list[i], "image");
      if ("error" in res) setError(res.error);
      else added.push(res.path);
    }
    setProgress(null);
    onChange([...value, ...added]);
    if (input.current) input.current.value = "";
  }

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={`${src}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl bg-[#f7f3eb]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl(src)} alt={`Foto ${i + 1}`} className="size-full object-cover" />
            <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} aria-label="Geser ke kiri" className="grid size-7 place-items-center rounded-full bg-white/90 text-xs font-bold shadow">
                  &larr;
                </button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Geser ke kanan" className="grid size-7 place-items-center rounded-full bg-white/90 text-xs font-bold shadow">
                  &rarr;
                </button>
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, k) => k !== i))}
                aria-label="Hapus foto"
                className="grid size-7 place-items-center rounded-full bg-white/90 text-sm font-bold shadow"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
        {value.length < max ? (
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={!!progress}
            className="grid aspect-square place-items-center rounded-xl border border-dashed border-ink/20 bg-[#f7f3eb] p-2 text-center text-[13px] font-semibold text-muted hover:text-ink"
          >
            {progress ?? "+ Tambah foto"}
          </button>
        ) : null}
      </div>
      <p className="text-[13px] text-muted">
        {value.length} dari {max} foto. Bisa pilih banyak foto sekaligus. Foto otomatis dikecilkan supaya undangan cepat dibuka.
      </p>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <input ref={input} type="file" hidden multiple accept={ACCEPT.image} onChange={(e) => pick(e.target.files)} />
    </div>
  );
}
