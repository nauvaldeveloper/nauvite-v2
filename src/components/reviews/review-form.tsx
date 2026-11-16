"use client";

import { useActionState, useState } from "react";
import { Button, Field, Input, Notice, Textarea } from "@/components/ui";
import type { ReviewFormState } from "@/lib/reviews/actions";

export function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5 text-gold" aria-label={`${value} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" className={n <= value ? "" : "opacity-25"}>
          <path fill="currentColor" d="m10 1.8 2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.8l-5.1 2.8 1.1-5.8-4.3-4 5.8-.7Z" />
        </svg>
      ))}
    </span>
  );
}

/** Form ulasan dengan pilihan bintang. Dipakai klien (dasbor) dan admin (ulasan manual). */
export function ReviewForm({
  action,
  defaultCoupleName = "",
  consentLabel,
  submitLabel = "Kirim ulasan",
}: {
  action: (prev: ReviewFormState, formData: FormData) => Promise<ReviewFormState>;
  defaultCoupleName?: string;
  consentLabel: string;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(action, { status: "idle" });
  const [rating, setRating] = useState(5);

  if (state.status === "ok") return <Notice tone="success">{state.message}</Notice>;

  return (
    <form action={formAction} className="grid gap-4">
      {state.status === "error" ? <Notice tone="error">{state.message}</Notice> : null}
      <div className="grid gap-1.5">
        <span className="text-[13px] font-semibold text-ink/80">Penilaian</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} bintang`}
              aria-pressed={rating === n}
              className={`text-[30px] leading-none transition-transform hover:scale-110 ${n <= rating ? "text-gold" : "text-ink/15"}`}
            >
              <svg viewBox="0 0 20 20" width="30" height="30" aria-hidden="true">
                <path fill="currentColor" d="m10 1.8 2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.8l-5.1 2.8 1.1-5.8-4.3-4 5.8-.7Z" />
              </svg>
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama pasangan" htmlFor="rv-name" hint="Tampil di bawah ulasan, mis. Dimas & Laras">
          <Input id="rv-name" name="coupleName" defaultValue={defaultCoupleName} maxLength={80} required />
        </Field>
        <Field label="Kota" htmlFor="rv-city" hint="Opsional">
          <Input id="rv-city" name="city" maxLength={60} placeholder="mis. Bandung" />
        </Field>
      </div>
      <Field label="Ulasan" htmlFor="rv-msg">
        <Textarea id="rv-msg" name="message" rows={4} maxLength={600} placeholder="Ceritakan pengalaman kalian memakai Nauvite." required />
      </Field>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" defaultChecked className="mt-0.5 size-4 accent-[#17261f]" />
        <span>{consentLabel}</span>
      </label>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Mengirim..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
