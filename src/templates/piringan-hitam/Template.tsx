import { Figtree, Shrikhand } from "next/font/google";
import Link from "next/link";
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
  formatDayDate,
  formatLongDate,
  formatTimeRange,
  googleCalendarUrl,
  mainEventDate,
  mediaUrl,
  parentsText,
  toDate,
  youtubeId,
} from "@/lib/invitation/format";
import { resolveOptions } from "../options";
import type { TemplateProps } from "../types";
import { Band, BloomDisc, Garden, PlainDisc, Reels, Tonearm } from "./art";
import manifest from "./manifest";
import { Cover, Turntable } from "./parts";
import s from "./template.module.css";

/** Tema Piringan Hitam: undangan tanpa foto bergaya album 70-an. */

const head = Shrikhand({ subsets: ["latin"], weight: "400", variable: "--ph-head" });
const body = Figtree({ subsets: ["latin"], variable: "--ph-body" });

const PALETTE: Record<string, string> = { senja: s.senja, laguna: s.laguna, anggrek: s.anggrek };

const initial = (name: string, fallback: string) => (name.trim()[0] ?? fallback).toUpperCase();
const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

export default function PiringanHitam({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const dateText = main ? formatLongDate(main) : content.weddingDate;
  const ring = (main ? formatDayDate(main) : "Hari bahagia").toUpperCase();
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const gi = initial(groom.name, "P");
  const bi = initial(bride.name, "W");
  const video = youtubeId(content.youtubeUrl);
  const guest = guestName ?? "Tamu Undangan";
  const longest = Math.max(groomName.length, brideName.length);

  const items = [
    { id: "awal", label: "Awal" },
    { id: "mempelai", label: "Mempelai" },
    ...(content.stories.length ? [{ id: "cerita", label: "Daftar lagu" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Acara" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
    { id: "ucapan", label: "Titip salam" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div className={`${s.root} ${PALETTE[o.palette] ?? s.senja} ${head.variable} ${body.variable}`}>
        <Cover
          foliage={
            <>
              <Garden className={`${s.garden} ${s.gardenLeft}`} />
              <Garden className={`${s.garden} ${s.gardenRight}`} />
            </>
          }
          disc={<PlainDisc id="cincin-sampul" ring={ring} center={`${gi}&${bi}`} className={s.recordSvg} />}
          sleeve={
            <>
              <div className={s.sleeveArt}>
                <BloomDisc id="cincin-seni" petals={10} />
              </div>
              <h1 className={s.sleeveTitle} data-long={longest > 8}>
                <span>{groomName}</span>
                <span>&amp; {brideName}</span>
              </h1>
              {dateText ? <p className={s.sleeveDate}>{dateText}</p> : null}
              <p className={s.sticker}>
                <small>Kepada Yth.</small>
                <span data-long={guest.length > 18}>{guest}</span>
              </p>
            </>
          }
        />

        <main className={s.main}>
          <section id="awal" className={s.hero}>
            <Reveal className={`${s.heroText} ${s.reveal}`}>
              <p>Kami akan menikah</p>
              <h2 className={s.names} data-long={longest > 9}>
                <span>{groomName}</span>
                <span>&amp; {brideName}</span>
              </h2>
              {dateText ? <p className={s.heroDate}>{dateText}</p> : null}
            </Reveal>
            <Reveal className={s.heroDisc}>
              <Turntable disc={<BloomDisc id="cincin-depan" ring={ring} center={`${gi}&${bi}`} />} arm={<Tonearm />} />
            </Reveal>
          </section>

          <section className={`${s.section} ${s.notes}`}>
            <Reveal className={s.reveal}>
              {o.greeting === "islami" ? <p>Assalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
              <p className={s.dear}>Untuk {guestName ?? "Bapak/Ibu/Saudara/i"},</p>
              {o.notes.split(/\n\s*\n/).map((t, i) => (
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

          <section id="mempelai" className={`${s.section} ${s.couple}`}>
            <h2 className={s.heading}>Mempelai</h2>
            <Person person={groom} role="Putra" letter={gi} id="cincin-pria" />
            <Person person={bride} role="Putri" letter={bi} id="cincin-wanita" />
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={`${s.section} ${s.tracks}`}>
              <h2 className={s.heading}>Daftar lagu</h2>
              <ol>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={s.reveal}>
                    <p className={s.trackRow}>
                      <b>{story.title}</b>
                      <i aria-hidden="true" />
                      {story.date ? <span>{story.date}</span> : null}
                    </p>
                    {story.description ? <p>{story.description}</p> : null}
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {main ? (
            <section className={`${s.section} ${s.count}`}>
              <Reveal className={s.bandWrap}>
                <Band />
              </Reveal>
              <h2 className={s.heading}>Rilis dalam</h2>
              <Reveal className={s.reveal}>
                <Countdown
                  target={main.toISOString()}
                  className={s.countdown}
                  itemClassName={s.countItem}
                  doneText="Lagunya sudah diputar. Terima kasih atas doanya."
                />
              </Reveal>
            </section>
          ) : null}

          {content.events.length > 0 ? (
            <section id="acara" className={`${s.section} ${s.events}`}>
              <h2 className={s.heading}>Acara</h2>
              <div className={s.list}>
                {content.events.map((event, i) => (
                  <Side key={i} event={event} index={i} title={title} />
                ))}
              </div>
            </section>
          ) : null}

          {video ? (
            <section className={s.section}>
              <h2 className={s.heading}>Video</h2>
              <YoutubeVideo id={video} title={`Video ${title}`} />
            </section>
          ) : null}

          {content.gifts.length > 0 ? (
            <section id="kado" className={`${s.section} ${s.gifts}`}>
              <h2 className={s.heading}>Tanda kasih</h2>
              <p className={s.lead}>Doa Anda sudah lebih dari cukup. Bagi yang ingin mengirim tanda kasih:</p>
              <div className={s.list}>
                {content.gifts.map((gift, i) => {
                  const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                  return (
                    <Reveal key={i} className={`${s.cassette} ${s.reveal}`}>
                      <div className={s.cassetteLabel}>
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt={gift.bank} />
                        ) : (
                          <b>{gift.bank}</b>
                        )}
                        {gift.accountName ? <p>a.n. {gift.accountName}</p> : null}
                        <p className={s.account}>{gift.accountNumber}</p>
                      </div>
                      <Reels />
                      <CopyButton value={gift.accountNumber} className={s.cassetteButton} label="Salin nomor" />
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section id="ucapan" className={`${s.section} ${s.replies}`}>
            <h2 className={s.heading}>Titip salam</h2>
            <p className={s.lead}>Kabari kami apakah Anda bisa datang, lalu titip salam dan doa untuk kami.</p>
            <div className={s.formBox}>
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
              cls={{ list: s.wishes, item: s.wish, name: s.wishName, message: s.wishMessage, date: s.wishDate, empty: s.lead }}
            />
          </section>

          <footer className={s.footer}>
            <Reveal className={s.bandWrap}>
              <Band />
            </Reveal>
            <p>Terima kasih sudah mendengarkan sampai lagu terakhir.</p>
            {o.greeting === "islami" ? <p>Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
            <p className={s.footerNames}>{title}</p>
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
              Dirilis oleh <Link href="/">Nauvite</Link>
            </p>
          </footer>
        </main>

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={6200} />
      </div>
    </OpeningProvider>
  );
}

function Person({ person, role, letter, id }: { person: InvitationPerson; role: "Putra" | "Putri"; letter: string; id: string }) {
  const parents = parentsText(person, role);
  return (
    <Reveal className={`${s.person} ${s.reveal}`}>
      <BloomDisc id={id} center={letter} ring={(person.name || letter).slice(0, 18).toUpperCase()} petals={10} />
      <h3>{person.fullname || person.name}</h3>
      {parents ? (
        <p>
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
        <a href={person.social.url} target="_blank" rel="noreferrer">
          <SocialIcon kind={person.social.kind} /> @{person.social.handle}
        </a>
      ) : null}
    </Reveal>
  );
}

/** Satu acara sebagai sisi piringan. Piringannya keluar dari sampul saat terlihat. */
function Side({ event, index, title }: { event: InvitationEvent; index: number; title: string }) {
  const d = toDate(event.date, event.startTime);
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  const letter = "ABCDEF"[index] ?? "A";
  return (
    <Reveal as="article" className={`${s.side} ${s.reveal}`} data-kind={index % 2}>
      <div className={s.sideTop}>
        <div className={s.sideDisc}>
          <PlainDisc id={`cincin-acara-${index}`} center={letter} ring={`SISI ${letter}`} className={s.sideSvg} />
        </div>
        <div className={s.sideSleeve}>
          <p>Sisi {letter}</p>
          {d ? (
            <p className={s.sideDate}>
              <b>{part(d, { day: "numeric" })}</b>
              {part(d, { month: "long" })}
            </p>
          ) : null}
        </div>
      </div>
      <div className={s.sideBody}>
        <h3>{event.title}</h3>
        {date ? <p>{date}</p> : null}
        {time ? <p>{time}</p> : null}
        {event.location ? (
          <p>
            <b>{event.location}</b>
          </p>
        ) : null}
        {event.address ? <p>{event.address}</p> : null}
        {event.entertainment ? <p>Hiburan: {event.entertainment}</p> : null}
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
      </div>
    </Reveal>
  );
}
