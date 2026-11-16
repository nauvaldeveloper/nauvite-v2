"use client";

import { useActionState, useState } from "react";
import { signIn, type LoginState } from "@/lib/auth/actions";
import { Button, Field, Input, Notice } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-8 grid gap-4">
      <input type="hidden" name="next" value={next} />
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      <Field label="Username atau email" htmlFor="identifier">
        <Input
          id="identifier"
          name="identifier"
          autoComplete="username"
          autoCapitalize="none"
          defaultValue={state.identifier}
          placeholder="mis. budi-ani"
          required
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            className="pr-20"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute inset-y-0 right-2 my-auto h-8 rounded-full px-3 text-xs font-semibold text-muted hover:bg-ink/5"
          >
            {show ? "Sembunyikan" : "Lihat"}
          </button>
        </div>
      </Field>
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Memeriksa..." : "Masuk"}
      </Button>
      <p className="text-center text-[13px] leading-relaxed text-muted">
        Lupa password? Hubungi admin Nauvite lewat WhatsApp untuk dibuatkan yang baru.
      </p>
    </form>
  );
}
