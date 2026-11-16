/**
 * Kerangka isi halaman saat pindah menu di panel. Menu samping tetap di tempat,
 * hanya bagian isi yang diganti kerangka ini sampai datanya siap.
 */
export function PanelContentLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Memuat">
      <div className="h-4 w-36 rounded-full bg-ink/[0.07]" />
      <div className="mt-3 h-9 w-64 max-w-full rounded-full bg-ink/[0.08]" />
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-ink/[0.05]" />
        ))}
      </div>
      <div className="mt-6 h-72 rounded-2xl bg-ink/[0.04]" />
    </div>
  );
}

/** Tampilan sementara selama data panel dimuat (bentuknya mengikuti kerangka panel). */
export function PanelLoading() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      <div className="hidden bg-ink lg:block" />
      <div className="mx-auto w-full max-w-6xl animate-pulse px-4 pt-10 sm:px-6 lg:px-10">
        <div className="h-4 w-40 rounded-full bg-ink/[0.07]" />
        <div className="mt-3 h-9 w-72 rounded-full bg-ink/[0.08]" />
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-ink/[0.05]" />
          ))}
        </div>
        <div className="mt-6 h-72 rounded-2xl bg-ink/[0.04]" />
      </div>
    </div>
  );
}
