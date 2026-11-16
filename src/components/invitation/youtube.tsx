"use client";

import { useState } from "react";
import { IconPlay } from "./icons";

/**
 * Video YouTube yang baru dimuat saat tamu menekan tombol putar.
 * Sebelum itu hanya gambar sampul video, jadi undangan tetap ringan.
 */
export function YoutubeVideo({ id, title, className }: { id: string; title: string; className?: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={className} style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden" }}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Putar video: ${title}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            border: 0,
            padding: 0,
            cursor: "pointer",
            background: `#000 url(https://i.ytimg.com/vi/${id}/hqdefault.jpg) center / cover`,
          }}
        >
          <span
            style={{
              display: "inline-grid",
              placeItems: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgb(0 0 0 / 0.55)",
              color: "#fff",
              fontSize: 28,
            }}
          >
            <IconPlay />
          </span>
        </button>
      )}
    </div>
  );
}
