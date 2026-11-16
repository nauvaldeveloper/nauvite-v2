import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f0e8] px-6 text-center text-[#1e2622]">
      <div className="max-w-sm">
        <h1 className="text-2xl font-semibold">Undangan tidak ditemukan</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#5b655f]">
          Link undangan ini salah ketik, belum diterbitkan, atau masa aktifnya sudah berakhir. Coba cek lagi
          link yang dikirim kepada Anda.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm underline underline-offset-4">
          Ke halaman Nauvite
        </Link>
      </div>
    </main>
  );
}
