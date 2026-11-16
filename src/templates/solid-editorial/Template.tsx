import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Link from "next/link";
import type { CSSProperties } from "react";
import { OpeningProvider } from "@/components/invitation/opening";
import { Countdown } from "@/components/invitation/countdown";
import { CopyButton } from "@/components/invitation/copy-button";
import { Reveal } from "@/components/invitation/reveal";
import { WishForm } from "@/components/invitation/wish-form";
import { WishList } from "@/components/invitation/wish-list";
import type { InvitationPerson } from "@/lib/invitation/content";
import {
  bankLogo,
  coupleTitle,
  formatDayDate,
  formatShortDate,
  formatTimeRange,
  eventDateText,
  googleCalendarUrl,
  mainEventDate,
  mediaUrl,
  parentsText,
} from "@/lib/invitation/format";
import type { MediaValue } from "../manifest";
import { resolveOptions } from "../options";
import type { TemplateProps } from "../types";
import manifest from "./manifest";
import { Cover, MusicButton } from "./parts";
import s from "./template.module.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--se-serif",
});
const sans = DM_Sans({ subsets: ["latin"], variable: "--se-sans" });

// Lapisan warna dibuat lebih tipis karena sudah dibantu bayangan gelap di atas dan bawah (.bgShade).
const OVERLAY = { tipis: 0.2, sedang: 0.34, pekat: 0.55 } as const;

export default function SolidEditorial({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const opt = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const { groom, bride } = content.couple;
  const title = coupleTitle(content);
  const main = mainEventDate(content);

  const style = {
    "--se-accent": opt.overlayColor,
    "--se-overlay": OVERLAY[opt.overlayStrength as keyof typeof OVERLAY] ?? OVERLAY.sedang,
    "--se-heading": opt.headingFont === "sans" ? "var(--se-sans)" : "var(--se-serif)",
  } as CSSProperties;

  const background = <Background media={opt.background} />;

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div className={`${s.root} ${serif.variable} ${sans.variable}`} style={style}>
        <Cover
          background={background}
          guestName={guestName}
          top={<Ornament label="Undangan Pernikahan" />}
          center={
            <>
              <Names groom={groom.name} bride={bride.name} as="h1" />
              {main ? <p className={s.coverDate}>{formatDayDate(main)}</p> : null}
            </>
          }
        />

        {/* Panel kiri di layar lebar: latar + nama, tetap di tempat saat isi di-scroll */}
        <aside className={s.side} aria-hidden="true">
          {background}
          <div className={s.sideInner}>
            <Ornament label="Undangan Pernikahan" />
            <Names groom={groom.name} bride={bride.name} />
            {main ? <p className={s.coverDate}>{formatDayDate(main)}</p> : null}
          </div>
        </aside>

        <main className={s.main}>
          <section className={s.hero}>
            {background}
            <div className={s.heroInner}>
              <Ornament label="Kami akan menikah" />
              <Names groom={groom.name} bride={bride.name} as="h2" />
              {main ? <p className={s.coverDate}>{formatShortDate(main)}</p> : null}
            </div>
            <a href="#pembuka" className={s.scrollCue} aria-label="Gulir ke isi undangan">
              <span />
            </a>
          </section>

          <section id="pembuka" className={s.section}>
            <Reveal className={s.reveal}>
              <p className={s.lead}>
                Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa
                restu di hari pernikahan kami.
              </p>
              {content.quotes ? (
                <figure className={s.quote}>
                  <blockquote>{content.quotes}</blockquote>
                  {content.quotesSource ? <figcaption>{content.quotesSource}</figcaption> : null}
                </figure>
              ) : null}
            </Reveal>
          </section>

          <section className={s.section}>
            <h2 className={s.heading}>Mempelai</h2>
            <div className={s.couple}>
              <Person person={groom} role="Putra" />
              <p className={s.ampersand} aria-hidden="true">
                &amp;
              </p>
              <Person person={bride} role="Putri" />
            </div>
          </section>

          {content.events.length > 0 ? (
            <section className={`${s.section} ${s.dark}`}>
              <h2 className={s.heading}>Waktu dan Tempat</h2>
              {main ? (
                <Countdown
                  target={main.toISOString()}
                  className={s.countdown}
                  itemClassName={s.countdownItem}
                />
              ) : null}
              <div className={s.events}>
                {content.events.map((event, i) => {
                  const date = eventDateText(event);
                  const time = formatTimeRange(event);
                  const cal = googleCalendarUrl(event, title);
                  return (
                    <Reveal key={i} className={`${s.event} ${s.reveal}`}>
                      <h3 className={s.eventTitle}>{event.title}</h3>
                      {date ? <p className={s.eventDate}>{date}</p> : null}
                      {time ? <p>{time}</p> : null}
                      {event.location ? <p className={s.eventPlace}>{event.location}</p> : null}
                      {event.address ? <p className={s.muted}>{event.address}</p> : null}
                      <div className={s.actions}>
                        {event.mapsUrl ? (
                          <a className={s.button} href={event.mapsUrl} target="_blank" rel="noreferrer">
                            Lihat lokasi
                          </a>
                        ) : null}
                        {cal ? (
                          <a className={s.buttonGhost} href={cal} target="_blank" rel="noreferrer">
                            Simpan ke kalender
                          </a>
                        ) : null}
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ) : null}

          {content.stories.length > 0 ? (
            <section className={s.section}>
              <h2 className={s.heading}>Cerita Kami</h2>
              <ol className={s.timeline}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.story} ${s.reveal}`}>
                    {story.date ? <p className={s.storyDate}>{story.date}</p> : null}
                    <h3 className={s.storyTitle}>{story.title}</h3>
                    {story.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className={s.storyImage} src={mediaUrl(story.image)} alt="" loading="lazy" />
                    ) : null}
                    {story.description ? <p>{story.description}</p> : null}
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {content.gallery.length > 0 ? (
            <section className={s.section}>
              <h2 className={s.heading}>Galeri</h2>
              <div className={s.gallery}>
                {content.gallery.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={mediaUrl(src)}
                    alt={`Foto ${i + 1}`}
                    loading="lazy"
                    className={s.galleryItem}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {content.gifts.length > 0 ? (
            <section className={s.section}>
              <h2 className={s.heading}>Tanda Kasih</h2>
              <p className={`${s.center} ${s.muted}`}>
                Doa restu Anda sudah sangat berarti. Bagi yang ingin memberikan tanda kasih, dapat melalui
                rekening berikut.
              </p>
              <div className={s.gifts}>
                {content.gifts.map((gift, i) => (
                  <Reveal key={i} className={`${s.gift} ${s.reveal}`}>
                    {(() => {
                      const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                      return logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={s.giftLogo} src={logo} alt={gift.bank} />
                      ) : (
                        <p className={s.giftBank}>{gift.bank}</p>
                      );
                    })()}
                    <p className={s.giftNumber}>{gift.accountNumber}</p>
                    <p className={s.muted}>a.n. {gift.accountName}</p>
                    <CopyButton value={gift.accountNumber} className={s.buttonGhost} />
                  </Reveal>
                ))}
              </div>
            </section>
          ) : null}

          <section className={s.section}>
            <h2 className={s.heading}>Ucapan dan Doa</h2>
            <WishForm
              slug={slug}
              defaultName={guestName ?? undefined}
              cls={{
                form: s.form,
                field: s.field,
                label: s.label,
                input: s.input,
                textarea: s.input,
                choices: s.choices,
                choice: s.choice,
                error: s.error,
                button: s.button,
                notice: s.notice,
              }}
            />
            <WishList
              slug={slug}
              cls={{
                list: s.wishes,
                item: s.wish,
                name: s.wishName,
                message: s.wishMessage,
                date: s.wishDate,
                empty: `${s.muted} ${s.center}`,
              }}
            />
          </section>

          <section className={s.closing}>
            {background}
            <div className={s.heroInner}>
              <p className={s.lead}>
                Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa
                restu.
              </p>
              <p className={s.eyebrow}>Kami yang berbahagia</p>
              <Names groom={groom.name} bride={bride.name} />
            </div>
          </section>

          <footer className={s.footer}>
            {invitation.partner?.name ? (
              <p>
                Dipersembahkan oleh{" "}
                {invitation.partner.url ? (
                  <a href={invitation.partner.url} target="_blank" rel="noreferrer">
                    {invitation.partner.name}
                  </a>
                ) : (
                  invitation.partner.name
                )}
              </p>
            ) : null}
            <p>
              Dibuat dengan <Link href="/">Nauvite</Link>
            </p>
          </footer>
        </main>

        <MusicButton />
      </div>
    </OpeningProvider>
  );
}

/** Garis tipis dengan ranting kecil di tengah, plus label di bawahnya. */
function Ornament({ label }: { label: string }) {
  return (
    <div className={s.ornament}>
      <span className={s.ornamentRow}>
        <i />
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M12 21V9M12 13c-2.5 0-4.5-1.6-5-4 2.5 0 4.5 1.6 5 4Zm0-3c2.5 0 4.5-1.6 5-4-2.5 0-4.5 1.6-5 4Zm0-1c0-2.2 1-4 2.6-5.5C12.8 4 12 6 12 9Zm0 0c0-3-.8-5-2.6-5.5C11 5 12 6.8 12 9Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <i />
      </span>
      <p className={s.eyebrow}>{label}</p>
    </div>
  );
}

/** Nama pasangan bertumpuk: Dimas / & / Laras */
function Names({ groom, bride, as: Tag = "p" }: { groom: string; bride: string; as?: "h1" | "h2" | "p" }) {
  return (
    <Tag className={s.names}>
      <span>{groom || "Mempelai Pria"}</span>
      <span className={s.namesAmp}>&amp;</span>
      <span>{bride || "Mempelai Wanita"}</span>
    </Tag>
  );
}

function Background({ media }: { media: MediaValue | null }) {
  if (!media) return <div className={s.bg} />;
  const src = mediaUrl(media.src);
  const poster = mediaUrl(media.poster);
  return (
    <div className={s.bg}>
      {media.kind === "video" ? (
        <>
          {/* Gambar diam untuk pengunjung yang mematikan animasi */}
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={s.bgStill} src={poster} alt="" />
          ) : null}
          <video className={s.bgMedia} src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" />
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={s.bgMedia} src={src} alt="" />
      )}
      <div className={s.bgOverlay} />
      <div className={s.bgShade} />
    </div>
  );
}

function Person({ person, role }: { person: InvitationPerson; role: "Putra" | "Putri" }) {
  const parents = parentsText(person, role);
  return (
    <Reveal className={`${s.person} ${s.reveal}`}>
      {person.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={s.personImage} src={mediaUrl(person.image)} alt={person.fullname || person.name} />
      ) : null}
      <h3 className={s.personName}>{person.fullname || person.name}</h3>
      {parents ? (
        <p className={s.muted}>
          {parents.prefix}
          {parents.names ? (
            <>
              <br />
              {parents.names}
            </>
          ) : null}
        </p>
      ) : null}
      {person.social ? (
        <a className={s.instagram} href={person.social.url} target="_blank" rel="noreferrer">
          @{person.social.handle}
        </a>
      ) : null}
    </Reveal>
  );
}
