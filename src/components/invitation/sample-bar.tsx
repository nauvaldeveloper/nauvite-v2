/** Bilah tipis di atas undangan yang belum terbit (contoh atau uji coba). */
export function SampleBar({ text, href, action }: { text: string; href?: string; action?: string }) {
  return (
    <div
      style={{
        position: "fixed",
        insetInline: 0,
        top: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        minHeight: 42,
        padding: "5px 14px",
        background: "#17261f",
        color: "#f3eee5",
        font: "600 13px/1.3 system-ui, sans-serif",
      }}
    >
      <span>{text}</span>
      {href ? (
        <a
          href={href}
          style={{ flex: "none", padding: "7px 14px", borderRadius: 99, background: "#c99c34", color: "#17261f", textDecoration: "none" }}
        >
          {action}
        </a>
      ) : null}
    </div>
  );
}
