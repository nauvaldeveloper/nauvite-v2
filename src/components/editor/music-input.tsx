"use client";

import { useId, useState } from "react";
import { cx } from "@/components/ui";
import { mediaUrl } from "@/lib/invitation/format";
import { DEFAULT_MUSIC, defaultMusicFor } from "@/lib/invitation/music";
import { MediaInput } from "./media-input";

type Mode = "default" | "own" | "off";

const CHOICES: { mode: Mode; label: string; help: string }[] = [
  { mode: "default", label: "Lagu bawaan tema", help: "Sudah disiapkan sesuai tema undangan." },
  { mode: "own", label: "Lagu sendiri", help: "Unggah MP3 pilihan kalian." },
  { mode: "off", label: "Tanpa lagu", help: "Undangan dibuka tanpa suara." },
];

const modeOf = (value: string | undefined): Mode => (!value ? "off" : value === DEFAULT_MUSIC ? "default" : "own");

/** Pilihan lagu latar: bawaan tema, unggahan sendiri, atau tanpa lagu. */
export function MusicInput({
  invitationId,
  templateId,
  value,
  onChange,
}: {
  invitationId: string;
  templateId: string;
  value?: string;
  onChange: (value: string | undefined) => void;
}) {
  const name = useId();
  const [mode, setMode] = useState<Mode>(modeOf(value));
  // Lagu unggahan diingat, jadi tidak hilang saat klien mencoba pilihan lain.
  const [own, setOwn] = useState(modeOf(value) === "own" ? value : undefined);

  function choose(next: Mode) {
    setMode(next);
    onChange(next === "default" ? DEFAULT_MUSIC : next === "own" ? own : undefined);
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="mb-1.5 text-sm font-semibold">Lagu latar</legend>
      <div className="grid gap-2">
        {CHOICES.map((c) => (
          <label
            key={c.mode}
            className={cx(
              "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 focus-within:ring-2 focus-within:ring-brass",
              mode === c.mode ? "border-ink bg-white" : "border-line hover:border-brass",
            )}
          >
            <input
              type="radio"
              name={name}
              checked={mode === c.mode}
              onChange={() => choose(c.mode)}
              className="mt-1 size-4 accent-ink"
            />
            <span>
              <span className="block text-sm font-semibold">{c.label}</span>
              <span className="block text-[13px] text-muted">{c.help}</span>
            </span>
          </label>
        ))}
      </div>
      {mode === "default" ? (
        <audio key={templateId} src={mediaUrl(defaultMusicFor(templateId))} controls preload="none" className="w-full" />
      ) : null}
      {mode === "own" ? (
        <div className="grid gap-2">
          <MediaInput
            invitationId={invitationId}
            value={own}
            kind="audio"
            label="Unggah lagu"
            onChange={(p) => {
              setOwn(p);
              onChange(p);
            }}
          />
          <p className="text-[13px] text-muted">
            {own ? "MP3, maksimal 10 MB." : "MP3, maksimal 10 MB. Selama belum ada lagu, undangan dibuka tanpa suara."}
          </p>
        </div>
      ) : null}
    </fieldset>
  );
}
