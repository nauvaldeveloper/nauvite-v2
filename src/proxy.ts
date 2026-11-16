import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Memperbarui sesi login Supabase (token kedaluwarsa diganti yang baru)
// sebelum halaman dirender. Hanya berjalan di halaman yang butuh login,
// supaya halaman undangan tamu tetap cepat.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // Jangan taruh kode lain di antara createServerClient dan getClaims.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: ["/dasbor/:path*", "/admin/:path*", "/mitra/:path*", "/pratinjau/:path*", "/editor/:path*", "/rsvp/:path*", "/masuk"],
};
