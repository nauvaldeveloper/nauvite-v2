import type { ReactNode } from "react";
import s from "./landing.module.css";

/** Bingkai HP untuk menampilkan screenshot atau video undangan. */
export function Phone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${s.phone} ${className}`}>
      <div className={s.phoneScreen}>
        <span className={s.phoneNotch} aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
