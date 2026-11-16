"use client";

import { useActionState, useState } from "react";
import { submitWish, type WishFormState } from "@/lib/invitation/actions";

export type WishFormClasses = Partial<
  Record<
    | "form"
    | "field"
    | "label"
    | "input"
    | "textarea"
    | "choices"
    | "choice"
    | "error"
    | "button"
    | "notice",
    string
  >
>;

const ATTENDANCE = [
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak hadir" },
  { value: "belum_pasti", label: "Belum pasti" },
] as const;

/** Form ucapan + konfirmasi kehadiran. Tampilan diatur template lewat `cls`. */
export function WishForm({
  slug,
  defaultName,
  cls = {},
}: {
  slug: string;
  defaultName?: string;
  cls?: WishFormClasses;
}) {
  const [state, action, pending] = useActionState<WishFormState, FormData>(
    submitWish.bind(null, slug),
    { status: "idle" },
  );
  const [attendance, setAttendance] = useState<string>("");
  const [formKey, setFormKey] = useState(0);

  if (state.status === "ok") {
    return (
      <div className={cls.notice} role="status">
        <p>{state.message}</p>
        <button type="button" className={cls.button} onClick={() => setFormKey((k) => k + 1)}>
          Kirim ucapan lain
        </button>
      </div>
    );
  }

  return (
    <form key={formKey} action={action} className={cls.form} noValidate>
      <div className={cls.field}>
        <label className={cls.label} htmlFor="wish-name">
          Nama
        </label>
        <input
          id="wish-name"
          name="name"
          className={cls.input}
          defaultValue={defaultName}
          maxLength={60}
          autoComplete="name"
          required
        />
        {state.errors?.name ? <p className={cls.error}>{state.errors.name}</p> : null}
      </div>

      <fieldset className={cls.field}>
        <legend className={cls.label}>Konfirmasi kehadiran</legend>
        <div className={cls.choices}>
          {ATTENDANCE.map((a) => (
            <label key={a.value} className={cls.choice} data-checked={attendance === a.value}>
              <input
                type="radio"
                name="attendance"
                value={a.value}
                checked={attendance === a.value}
                onChange={() => setAttendance(a.value)}
              />
              {a.label}
            </label>
          ))}
        </div>
        {state.errors?.attendance ? <p className={cls.error}>{state.errors.attendance}</p> : null}
      </fieldset>

      {attendance === "hadir" ? (
        <div className={cls.field}>
          <label className={cls.label} htmlFor="wish-count">
            Jumlah yang hadir
          </label>
          <select id="wish-count" name="guestCount" className={cls.input} defaultValue="1">
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} orang
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className={cls.field}>
        <label className={cls.label} htmlFor="wish-message">
          Ucapan dan doa
        </label>
        <textarea
          id="wish-message"
          name="message"
          className={cls.textarea}
          rows={4}
          maxLength={500}
        />
        {state.errors?.message ? <p className={cls.error}>{state.errors.message}</p> : null}
      </div>

      {/* Jebakan bot, tidak terlihat oleh tamu */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      {state.message ? <p className={cls.error}>{state.message}</p> : null}

      <button type="submit" className={cls.button} disabled={pending}>
        {pending ? "Mengirim..." : "Kirim"}
      </button>
    </form>
  );
}
