import { Courier_Prime, Kalam, Karla } from "next/font/google";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { OpeningProvider } from "@/components/invitation/opening";
import { Countdown } from "@/components/invitation/countdown";
import { CopyButton } from "@/components/invitation/copy-button";
import { GuideDock } from "@/components/invitation/guide-dock";
import { IconCalendar, IconPin, SocialIcon } from "@/components/invitation/icons";
import { Reveal } from "@/components/invitation/reveal";
import { WishForm } from "@/components/invitation/wish-form";
import { WishList } from "@/components/invitation/wish-list";
import { YoutubeVideo } from "@/components/invitation/youtube";
import type { InvitationEvent, InvitationPerson } from "@/lib/invitation/content";
import {
  bankLogo,
  coupleTitle,
  eventDateText,
  formatTimeRange,
  googleCalendarUrl,
  mainEventDate,
  mediaUrl,
  parentsText,
  youtubeId,
} from "@/lib/invitation/format";
import { resolveOptions } from "../options";
import type { TemplateProps } from "../types";
import manifest from "./manifest";
import { Cover, HeroStage } from "./parts";
import s from "./template.module.css";

/** Tema Album Polaroid: album foto kenangan dengan polaroid, selotip, dan catatan tulisan tangan. */

const hand = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--ap-hand" });
const body = Karla({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--ap-body" });
const typed = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--ap-typed" });

const PALETTE: Record<string, string> = { krem: s.krem, kraft: s.kraft, hitam: s.hitam };

/** Kemiringan polaroid, tetap sama setiap kali dibuka. */
const TILT = [-3, 2.5, -1.5, 3.5, -2.5, 1.8];
const tilt = (i: number) => ({ "--tilt": `${TILT[i % TILT.length]}deg` }) as CSSProperties;

const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

export default function AlbumPolaroid({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const shortDate = main ? part(main, { day: "numeric", month: "long", year: "numeric" }) : content.weddingDate;
  const stamp = main ? part(main, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, " ") : "";
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const cover = mediaUrl(content.coverImage);
  const video = youtubeId(content.youtubeUrl);
  // Dua foto galeri mengintip di belakang polaroid utama.
  const backs = content.gallery.filter((g) => mediaUrl(g) !== cover).slice(0, 2).map((g) => mediaUrl(g));

  const items = [
    { id: "awal", label: "Awal" },
    { id: "mempelai", label: "Mempelai" },
    ...(content.stories.length ? [{ id: "cerita", label: "Cerita kami" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Acara" }] : []),
    ...(content.gallery.length ? [{ id: "galeri", label: "Foto" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
    { id: "ucapan", label: "Konfirmasi" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div
        className={`${s.root} ${PALETTE[o.palette] ?? s.krem} ${hand.variable} ${body.variable} ${typed.variable}`}
        data-develop={o.develop}
      >
        <Cover
          photo={
            cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" />
            ) : null
          }
        >
          <p className={s.albumKicker}>Album pernikahan</p>
          <h1 className={s.albumNames}>
            {groomName} <span>&amp;</span> {brideName}
          </h1>
          {shortDate ? <p className={s.albumDate}>{shortDate}</p> : null}
          <div className={s.albumGuest}>
            <p>Untuk</p>
            <p className={s.albumGuestName}>{guestName ?? "Bapak/Ibu/Saudara/i"}</p>
          </div>
        </Cover>

        <main className={s.main}>
          <HeroStage id="awal" className={s.hero}>
            <p className={`${s.heroKicker} ${s.step1}`}>Kami akan menikah</p>
            <div className={s.heroStack}>
              {backs.map((src, i) => (
                <div key={i} className={`${s.heroBack} ${i ? s.heroBackRight : s.heroBackLeft}`}>
                  <Polaroid src={src} alt="" />
                </div>
              ))}
              <div className={s.heroPhoto}>
                <Polaroid src={cover} alt={title} style={tilt(0)} big />
                {stamp ? <span className={s.dateStamp}>{stamp}</span> : null}
              </div>
            </div>
            <div className={`${s.heroText} ${s.step3}`}>
              <h2 className={s.heroNames}>
                {groomName} <span>&amp;</span> {brideName}
              </h2>
              {shortDate ? <p className={s.heroDate}>{shortDate}</p> : null}
            </div>
          </HeroStage>

          <section className={s.section}>
            <Reveal className={`${s.reveal} ${s.note} ${s.card}`} style={tilt(5)}>
              {o.greeting === "islami" ? <p className={s.salam}>Assalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
              <p className={s.to}>Untuk {guestName ?? "Bapak/Ibu/Saudara/i"},</p>
              {o.opening.split(/\n\s*\n/).map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </Reveal>
          </section>

          {content.quotes ? (
            <section className={`${s.section} ${s.quote}`}>
              <Reveal className={s.reveal}>
                <blockquote>{content.quotes}</blockquote>
                {content.quotesSource ? <p>{content.quotesSource}</p> : null}
              </Reveal>
            </section>
          ) : null}

          <section id="mempelai" className={`${s.section} ${s.alt}`}>
            <Heading>Mempelai</Heading>
            <div className={s.couple}>
              <Person person={groom} role="Putra" i={1} />
              <Person person={bride} role="Putri" i={2} />
            </div>
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={s.section}>
              <Heading>Cerita kami</Heading>
              <ol className={s.stories}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.story} ${s.reveal}`}>
                    {story.image ? (
                      <Polaroid src={mediaUrl(story.image)} alt="" style={tilt(i + 3)}>
                        {story.date || story.title}
                      </Polaroid>
                    ) : null}
                    <div className={s.storyText}>
                      {story.date && !story.image ? <p className={s.typedLabel}>{story.date}</p> : null}
                      <h3>{story.title}</h3>
                      {story.description ? <p>{story.description}</p> : null}
                    </div>
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {main ? (
            <section className={`${s.section} ${s.alt}`}>
              <Heading>Menghitung hari</Heading>
              <Reveal className={s.reveal}>
                <Countdown
                  target={main.toISOString()}
                  className={s.countdown}
                  itemClassName={s.countItem}
                  doneText="Hari bahagia kami sudah tiba. Terima kasih atas doanya."
                />
              </Reveal>
            </section>
          ) : null}

          {content.events.length > 0 ? (
            <section id="acara" className={s.section}>
              <Heading>Acara</Heading>
              <div className={s.events}>
                {content.events.map((event, i) => (
                  <EventCard key={i} event={event} title={title} i={i} />
                ))}
              </div>
            </section>
          ) : null}

          {content.gallery.length > 0 ? (
            <section id="galeri" className={`${s.section} ${s.alt}`}>
              <Heading>Foto-foto kami</Heading>
              <div className={s.gallery}>
                {content.gallery.map((src, i) => (
                  <Reveal key={i} className={s.reveal}>
                    <Polaroid src={mediaUrl(src)} alt={`Foto ${i + 1}`} style={tilt(i + 1)} />
                  </Reveal>
                ))}
              </div>
            </section>
          ) : null}

          {video ? (
            <section className={s.section}>
              <Heading>Video</Heading>
              <YoutubeVideo id={video} title={`Video ${title}`} className={s.video} />
            </section>
          ) : null}

          {content.gifts.length > 0 ? (
            <section id="kado" className={s.section}>
              <Heading>Tanda kasih</Heading>
              <p className={s.lead}>
                Doa restu Anda adalah hadiah terindah. Bagi yang ingin memberikan tanda kasih, dapat melalui rekening berikut.
              </p>
              <div className={s.gifts}>
                {content.gifts.map((gift, i) => {
                  const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                  return (
                    <Reveal key={i} className={`${s.gift} ${s.card} ${s.taped} ${s.reveal}`} style={tilt(i + 4)}>
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={s.bankLogo} src={logo} alt={gift.bank} />
                      ) : (
                        <b>{gift.bank}</b>
                      )}
                      <p className={s.account}>{gift.accountNumber}</p>
                      {gift.accountName ? <p>a.n. {gift.accountName}</p> : null}
                      <CopyButton value={gift.accountNumber} className={s.ghost} label="Salin nomor rekening" />
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section id="ucapan" className={`${s.section} ${s.alt}`}>
            <Heading>Konfirmasi kehadiran</Heading>
            <p className={s.lead}>Kabari kami apakah Anda bisa hadir, dan tuliskan doa untuk kami di halaman album ini.</p>
            <div className={`${s.formBox} ${s.card} ${s.lined}`}>
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
            </div>
            <WishList
              slug={slug}
              cls={{ list: s.wishes, item: `${s.wish} ${s.card}`, name: s.wishName, message: s.wishMessage, date: s.wishDate, empty: s.lead }}
            />
          </section>

          <footer className={s.footer}>
            <p>Terima kasih atas doa dan kehadiran Anda</p>
            {o.greeting === "islami" ? <p>Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
            <p className={s.footerNames}>
              {groomName} &amp; {brideName}
            </p>
            <div className={s.made}>
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
            </div>
          </footer>
        </main>

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={3800} />
      </div>
    </OpeningProvider>
  );
}

function Heading({ children }: { children: string }) {
  return <h2 className={s.heading}>{children}</h2>;
}

function Polaroid({
  src,
  alt,
  style,
  big,
  children,
}: {
  src: string | undefined | null;
  alt: string;
  style?: CSSProperties;
  big?: boolean;
  children?: ReactNode;
}) {
  return (
    <figure className={`${s.polaroid} ${big ? s.big : ""}`} style={style}>
      <span className={s.tape} aria-hidden="true" />
      <div className={s.photo}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} loading="lazy" />
        ) : null}
      </div>
      {children ? <figcaption>{children}</figcaption> : null}
    </figure>
  );
}

function Person({ person, role, i }: { person: InvitationPerson; role: "Putra" | "Putri"; i: number }) {
  const parents = parentsText(person, role);
  const name = person.fullname || person.name || role;
  return (
    <Reveal className={`${s.person} ${s.reveal}`}>
      <Polaroid src={person.image ? mediaUrl(person.image) : null} alt={name} style={tilt(i)}>
        {person.name || role}
      </Polaroid>
      <h3 className={s.personName}>{name}</h3>
      {parents ? (
        <p className={s.parents}>
          {parents.prefix} {parents.names}
        </p>
      ) : null}
      {person.social ? (
        <a className={s.social} href={person.social.url} target="_blank" rel="noreferrer">
          <SocialIcon kind={person.social.kind} /> @{person.social.handle}
        </a>
      ) : null}
    </Reveal>
  );
}

function EventCard({ event, title, i }: { event: InvitationEvent; title: string; i: number }) {
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  return (
    <Reveal as="article" className={`${s.event} ${s.card} ${s.lined} ${s.taped} ${s.reveal}`} style={tilt(i + 2)}>
      <h3>{event.title}</h3>
      {date ? <p className={s.eventDate}>{date}</p> : null}
      {time ? <p className={s.typedLabel}>{time}</p> : null}
      {event.location ? <p className={s.place}>{event.location}</p> : null}
      {event.address ? <p className={s.address}>{event.address}</p> : null}
      {event.entertainment ? <p className={s.address}>Hiburan: {event.entertainment}</p> : null}
      <div className={s.actions}>
        {event.mapsUrl ? (
          <a className={s.button} href={event.mapsUrl} target="_blank" rel="noreferrer">
            <IconPin /> Lihat lokasi
          </a>
        ) : null}
        {cal ? (
          <a className={s.ghost} href={cal} target="_blank" rel="noreferrer">
            <IconCalendar /> Simpan ke kalender
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}
