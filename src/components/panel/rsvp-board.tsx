"use client";

import { useMemo, useState, useTransition } from "react";
import { Badge, Button, cx } from "@/components/ui";
import { IconSearch } from "@/components/invitation/icons";
import { deleteWish } from "@/lib/invitation/rsvp-actions";

export type RsvpRow = {
  id: string;
  name: string;
  message: string | null;
  attendance: "hadir" | "tidak_hadir" | "belum_pasti" | null;
  guestCount: number;
  createdAt: string;
};

const LABEL: Record<string, { text: string; tone: "green" | "red" | "amber" | "gray" }> = {
  hadir: { text: "Hadir", tone: "green" },
  tidak_hadir: { text: "Tidak hadir", tone: "red" },
  belum_pasti: { text: "Belum pasti", tone: "amber" },
  none: { text: "Tanpa konfirmasi", tone: "gray" },
};

const FILTERS = [
  { value: "semua", label: "Semua" },
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak hadir" },
  { value: "belum_pasti", label: "Belum pasti" },
];

const timeFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

/** Daftar ucapan + RSVP: ringkasan, filter, cari, hapus spam, ekspor Excel. */
export function RsvpBoard({ rows: initialRows, title, slug }: { rows: RsvpRow[]; title: string; slug: string }) {
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState("semua");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, startExport] = useTransition();

  const stats = useMemo(() => {
    const hadir = rows.filter((r) => r.attendance === "hadir");
    return {
      total: rows.length,
      hadir: hadir.length,
      orang: hadir.reduce((n, r) => n + r.guestCount, 0),
      tidak: rows.filter((r) => r.attendance === "tidak_hadir").length,
      belum: rows.filter((r) => r.attendance === "belum_pasti").length,
    };
  }, [rows]);

  const shown = rows.filter((r) => {
    if (filter !== "semua" && r.attendance !== filter) return false;
    const s = q.trim().toLowerCase();
    return !s || r.name.toLowerCase().includes(s) || (r.message ?? "").toLowerCase().includes(s);
  });

  async function remove(row: RsvpRow) {
    if (!confirm(`Hapus ucapan dari "${row.name}"? Ucapan ini juga hilang dari undangan.`)) return;
    setBusyId(row.id);
    setError(null);
    const res = await deleteWish(row.id);
    setBusyId(null);
    if (res.ok) setRows((list) => list.filter((r) => r.id !== row.id));
    else setError(res.message ?? "Gagal menghapus.");
  }

  function exportExcel() {
    startExport(async () => {
      const { default: writeExcelFile } = await import("write-excel-file/browser");
      const header = ["No", "Nama", "Kehadiran", "Jumlah orang", "Ucapan", "Waktu kirim"].map((value) => ({
        value,
        fontWeight: "bold" as const,
        backgroundColor: "#E9DCC3",
      }));
      const data = rows.map((r, i) => [
        { value: i + 1 },
        { value: r.name, type: String },
        { value: LABEL[r.attendance ?? "none"].text, type: String },
        { value: r.attendance === "hadir" ? r.guestCount : 0 },
        { value: r.message ?? "", type: String, wrap: true },
        { value: new Date(r.createdAt), format: "dd/mm/yyyy hh:mm" },
      ]);
      const summary = [
        [],
        [{ value: "Ringkasan", fontWeight: "bold" as const }],
        [{ value: "Total ucapan" }, { value: stats.total }],
        [{ value: "Hadir" }, { value: stats.hadir }],
        [{ value: "Jumlah orang hadir" }, { value: stats.orang }],
        [{ value: "Tidak hadir" }, { value: stats.tidak }],
        [{ value: "Belum pasti" }, { value: stats.belum }],
      ];
      await writeExcelFile([header, ...data, ...summary], {
        sheet: "RSVP",
        columns: [{ width: 5 }, { width: 26 }, { width: 16 }, { width: 14 }, { width: 60 }, { width: 18 }],
        stickyRowsCount: 1,
      }).toFile(`RSVP ${title} (${slug}).xlsx`);
    });
  }

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
        <div className="col-span-3 rounded-2xl bg-ink p-5 text-[#f3eee5] lg:col-span-1">
          <p className="text-[13px] font-semibold text-[#c9d2cc]">Akan hadir</p>
          <p className="mt-2 font-display text-5xl font-medium tabular-nums">{stats.orang}</p>
          <p className="mt-1 text-[12px] text-[#9aa79f]">orang dari {stats.hadir} konfirmasi</p>
        </div>
        {[
          ["Ucapan masuk", stats.total],
          ["Tidak hadir", stats.tidak],
          ["Belum pasti", stats.belum],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-card p-3.5 sm:p-5">
            <p className="text-[12px] font-semibold text-muted sm:text-[13px]">{label}</p>
            <p className="mt-2 font-display text-4xl font-medium tabular-nums sm:text-5xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px] text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama atau ucapan"
            className="w-full rounded-full border border-line bg-card py-2.5 pl-10 pr-4 text-[15px] focus:border-brass focus:outline-none focus:ring-4 focus:ring-brass/15"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-full border border-line bg-card p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cx(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                filter === f.value ? "bg-ink text-[#f6f1e7]" : "text-muted hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button variant="brass" onClick={exportExcel} disabled={exporting || rows.length === 0} className="sm:ml-auto">
          {exporting ? "Menyiapkan..." : "Unduh Excel"}
        </Button>
      </div>

      {error ? <p className="rounded-xl bg-[#fbefed] px-4 py-3 text-sm text-[#7d2a20]">{error}</p> : null}

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 px-6 py-14 text-center">
          <p className="font-display text-2xl italic">{rows.length === 0 ? "Belum ada ucapan" : "Tidak ada yang cocok"}</p>
          <p className="mt-2 text-muted">
            {rows.length === 0 ? "Ucapan dan konfirmasi dari tamu akan muncul di sini." : "Coba filter atau kata kunci lain."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {shown.map((r) => {
            const a = LABEL[r.attendance ?? "none"];
            return (
              <li key={r.id} className="rounded-2xl border border-line bg-card p-4 sm:p-5">
                <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl">{r.name}</p>
                    <p className="text-[12px] text-muted">{timeFmt.format(new Date(r.createdAt))}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={a.tone}>{a.text}</Badge>
                    {r.attendance === "hadir" ? (
                      <span className="rounded-full bg-ink/[0.06] px-2.5 py-0.5 text-xs font-semibold tabular-nums">
                        {r.guestCount} orang
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => remove(r)}
                      disabled={busyId === r.id}
                      className="rounded-full px-3 py-1 text-[13px] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      {busyId === r.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
                {r.message ? <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed">{r.message}</p> : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
