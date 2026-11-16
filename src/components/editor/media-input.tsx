"use client";

import { useRef, useState } from "react";
import { mediaUrl } from "@/lib/invitation/format";
import { ACCEPT, uploadInvitationFile, type UploadKind } from "@/lib/invitation/upload";

/** Kotak unggah satu file (foto/video/lagu) dengan pratinjau dan tombol hapus. */
export function MediaInput({
  invitationId,
  value,
  onChange,
  kind = "image",
  kinds,
  label = "Unggah foto",
  aspect = "aspect-[4/5]",
  className = "",
}: {
  invitationId: string;
  value?: string | null;
  onChange: (path: string | undefined, kind?: UploadKind) => void;
  kind?: UploadKind;
  /** Kalau boleh lebih dari satu jenis (mis. foto atau video). */
  kinds?: UploadKind[];
  label?: string;
  aspect?: string;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const allowed = kinds ?? [kind];
  const url = mediaUrl(value);
  const isVideo = !!value && /\.(mp4|webm)$/i.test(value);
  const isAudio = !!value && /\.(mp3|m4a|aac|ogg)$/i.test(value);

  async function pick(file: File | undefined) {
    if (!file) return;
    setError(null);
    const k: UploadKind = file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "image";
    if (!allowed.includes(k)) {
      setError("Jenis file tidak sesuai.");
      return;
    }
    setBusy(true);
    const res = await uploadInvitationFile(invitationId, file, k);
    setBusy(false);
    if ("error" in res) setError(res.error);
    else onChange(res.path, k);
    if (input.current) input.current.value = "";
  }

  if (allowed.length === 1 && allowed[0] === "audio") {
    return (
      <div className={`grid gap-2 ${className}`}>
        {url && isAudio ? <audio src={url} controls className="w-full" /> : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-brass"
          >
            {busy ? "Mengunggah..." : url ? "Ganti lagu" : label}
          </button>
          {url ? (
            <button type="button" onClick={() => onChange(undefined)} className="rounded-full px-3 py-2 text-sm text-muted hover:bg-ink/5">
              Hapus
            </button>
          ) : null}
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <input ref={input} type="file" hidden accept={ACCEPT.audio} onChange={(e) => pick(e.target.files?.[0])} />
      </div>
    );
  }

  return (
    <div className={`grid gap-2 ${className}`}>
      <div className={`group relative overflow-hidden rounded-xl border border-dashed border-ink/20 bg-[#f7f3eb] ${aspect}`}>
        {url ? (
          isVideo ? (
            <video src={url} muted loop autoPlay playsInline className="absolute inset-0 size-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="absolute inset-0 size-full object-cover" />
          )
        ) : null}
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className={`absolute inset-0 grid place-items-center p-3 text-center text-[13px] font-semibold transition-colors ${
            url ? "bg-ink/0 text-transparent hover:bg-ink/45 hover:text-white" : "text-muted hover:text-ink"
          }`}
        >
          {busy ? <span className="rounded-full bg-white/90 px-3 py-1 text-ink">Mengunggah...</span> : url ? "Ganti" : `+ ${label}`}
        </button>
        {url && !busy ? (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label="Hapus"
            className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-white/90 text-sm font-bold text-ink shadow"
          >
            &times;
          </button>
        ) : null}
      </div>
      {error ? <p className="text-[13px] text-red-700">{error}</p> : null}
      <input
        ref={input}
        type="file"
        hidden
        accept={allowed.map((k) => ACCEPT[k]).join(",")}
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}
