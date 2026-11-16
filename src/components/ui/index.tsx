import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/**
 * Komponen dasar panel Nauvite. Warna dari token di globals.css:
 * ink (hijau tinta), paper (krem), card, brass (kuningan), muted, line.
 */

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "danger" | "ghost" | "brass";

const BUTTON: Record<Variant, string> = {
  primary: "bg-ink text-[#f6f1e7] hover:bg-ink-2 shadow-[0_1px_0_rgb(255_255_255/0.08)_inset]",
  secondary: "border border-line bg-card text-ink hover:border-ink/25",
  danger: "border border-red-200 bg-card text-red-700 hover:bg-red-50",
  ghost: "text-ink hover:bg-ink/[0.06]",
  brass: "bg-brass text-white hover:bg-[#946f35]",
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cx(buttonBase, BUTTON[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cx(buttonBase, BUTTON[variant], className)} {...props} />;
}

const fieldBase =
  "w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/35 transition-colors focus:border-brass focus:bg-white focus:outline-none focus:ring-4 focus:ring-brass/15";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(fieldBase, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx(fieldBase, "pr-8", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(fieldBase, className)} {...props} />;
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-ink/80">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-red-700">{error}</p>
      ) : hint ? (
        <p className="text-[13px] leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx("rounded-2xl border border-line bg-card p-5 shadow-[0_1px_2px_rgb(23_38_31/0.04)] sm:p-6", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, aside, hint }: { children: ReactNode; aside?: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight">{children}</h2>
        {hint ? <p className="mt-0.5 text-[13px] text-muted">{hint}</p> : null}
      </div>
      {aside}
    </div>
  );
}

const BADGE = {
  green: "bg-[#e3efe6] text-[#1d5a37]",
  gray: "bg-ink/[0.06] text-ink/70",
  amber: "bg-[#f6e7c8] text-[#7a5414]",
  red: "bg-[#f7dfdb] text-[#8f2a1f]",
};

export function Badge({ tone = "gray", children }: { tone?: keyof typeof BADGE; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", BADGE[tone])}>
      {children}
    </span>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "error"; children: ReactNode }) {
  const color = {
    info: "border-[#cfdde6] bg-[#eef4f7] text-[#1f3d4d]",
    success: "border-[#cfe3d5] bg-[#ecf5ee] text-[#1d4a30]",
    error: "border-[#efcfca] bg-[#fbefed] text-[#7d2a20]",
  }[tone];
  return <div className={cx("rounded-xl border px-4 py-3 text-sm", color)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="mb-1 text-[13px] font-semibold text-brass">{eyebrow}</p> : null}
        <h1 className="font-display text-3xl font-medium tracking-tight sm:text-[2.5rem] sm:leading-tight">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
