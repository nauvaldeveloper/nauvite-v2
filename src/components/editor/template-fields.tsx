"use client";

import { Field, Input, Textarea } from "@/components/ui";
import type { MediaValue, TemplateField, TemplateManifest } from "@/templates/manifest";
import { MediaInput } from "./media-input";

/**
 * Form isian khusus tema, dibangun otomatis dari manifest.
 * Menambah tema baru dengan isian baru tidak perlu mengubah file ini,
 * selama jenis isiannya salah satu dari: text, textarea, color, select, toggle, media.
 *
 * Nilai kosong = memakai nilai bawaan manifest (ditampilkan sebagai placeholder).
 */
export function TemplateFields({
  manifest,
  invitationId,
  values,
  onChange,
  errors = {},
}: {
  manifest: TemplateManifest;
  invitationId: string;
  values: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  errors?: Record<string, string>;
}) {
  if (manifest.fields.length === 0) {
    return <p className="text-[15px] text-muted">Tema {manifest.name} belum punya pengaturan khusus.</p>;
  }

  const set = (key: string, v: unknown) => {
    const next = { ...values };
    if (v === undefined || v === "") delete next[key];
    else next[key] = v;
    onChange(next);
  };

  return (
    <div className="grid gap-5">
      {manifest.fields.map((f) => (
        <FieldControl
          key={f.key}
          field={f}
          invitationId={invitationId}
          value={values[f.key]}
          error={errors[f.key]}
          onChange={(v) => set(f.key, v)}
        />
      ))}
    </div>
  );
}

function FieldControl({
  field,
  invitationId,
  value,
  error,
  onChange,
}: {
  field: TemplateField;
  invitationId: string;
  value: unknown;
  error?: string;
  onChange: (v: unknown) => void;
}) {
  const id = `tf-${field.key}`;
  const isDefault = value === undefined;

  switch (field.type) {
    case "text":
      return (
        <Field label={field.label} hint={field.help} error={error} htmlFor={id}>
          <Input
            id={id}
            value={(value as string) ?? ""}
            placeholder={field.default}
            maxLength={field.maxLength}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );
    case "textarea":
      return (
        <Field label={field.label} hint={field.help} error={error} htmlFor={id}>
          <Textarea
            id={id}
            rows={3}
            value={(value as string) ?? ""}
            placeholder={field.default}
            maxLength={field.maxLength}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );
    case "color": {
      const current = (value as string) ?? field.default;
      return (
        <Field label={field.label} hint={field.help} error={error} htmlFor={id}>
          <div className="flex items-center gap-3">
            <input
              id={id}
              type="color"
              value={current}
              onChange={(e) => onChange(e.target.value)}
              className="size-11 cursor-pointer rounded-xl border border-line bg-white p-1"
            />
            <span className="font-mono text-sm">{current}</span>
            {!isDefault ? (
              <button type="button" onClick={() => onChange(undefined)} className="text-[13px] font-semibold text-brass hover:underline">
                Kembalikan bawaan
              </button>
            ) : null}
          </div>
        </Field>
      );
    }
    case "select":
      return (
        <Field label={field.label} hint={field.help} error={error}>
          <div className="flex flex-wrap gap-2">
            {field.options.map((o) => {
              const active = ((value as string) ?? field.default) === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => onChange(o.value === field.default ? undefined : o.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? "border-ink bg-ink text-[#f6f1e7]" : "border-line bg-white hover:border-ink/30"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </Field>
      );
    case "toggle": {
      const on = (value as boolean | undefined) ?? field.default;
      return (
        <label className="flex cursor-pointer items-start justify-between gap-4">
          <span>
            <span className="block text-[13px] font-semibold text-ink/80">{field.label}</span>
            {field.help ? <span className="block text-[13px] text-muted">{field.help}</span> : null}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => onChange(!on === field.default ? undefined : !on)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-ink" : "bg-ink/20"}`}
          >
            <span className={`absolute top-1 size-5 rounded-full bg-white transition-all ${on ? "left-6" : "left-1"}`} />
          </button>
        </label>
      );
    }
    case "media": {
      const media = value as MediaValue | undefined;
      const shown = media ?? field.default;
      return (
        <Field
          label={field.label}
          error={error}
          hint={
            <>
              {field.help}
              {isDefault && field.default ? " Sekarang memakai bawaan tema." : ""}
            </>
          }
        >
          <div className="max-w-56">
            <MediaInput
              invitationId={invitationId}
              value={shown?.src}
              kinds={field.accept}
              label={field.accept.includes("video") ? "Unggah foto/video" : "Unggah foto"}
              aspect="aspect-[9/16]"
              onChange={(path, kind) =>
                onChange(path ? { kind: kind === "video" ? "video" : "image", src: path } : undefined)
              }
            />
          </div>
        </Field>
      );
    }
  }
}
