import { DM_Serif_Display, Figtree, Oswald } from "next/font/google";
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
import manifest from "./manifest";
import { Cover } from "./parts";
import s from "./template.module.css";

/** Tema Bioskop: pemutaran perdana dengan tirai, poster, roll film, dan kredit penutup. */

const title_ = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--bs-title" });
const poster = Oswald({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--bs-poster" });
const body = Figtree({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--bs-body" });

const PALETTE: Record<string, string> = { beludru: s.beludru, malam: s.malam, sepia: s.sepia };

const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

export default function Bioskop({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const shortDate = main ? part(main, { day: "numeric", month: "long", year: "numeric" }) : content.weddingDate;
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const cover = mediaUrl(content.coverImage);
  const video = youtubeId(content.youtubeUrl);
  const families = [parentsText(groom, "Putra")?.names, parentsText(bride, "Putri")?.names].filter(Boolean);

  const items = [
    { id: "awal", label: "Poster" },
    { id: "mempelai", label: "Pemeran utama" },
    ...(content.stories.length ? [{ id: "cerita", label: "Adegan" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Jadwal tayang" }] : []),
    ...(content.gallery.length ? [{ id: "galeri", label: "Cuplikan" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
    { id: "ucapan", label: "Konfirmasi" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div
        className={`${s.root} ${PALETTE[o.palette] ?? s.beludru} ${title_.variable} ${poster.variable} ${body.variable}`}
        data-grain={o.filmGrain}
      >
        <Cover
          guest={
            <div className={s.coverGuest}>
              <p>Undangan khusus untuk</p>
              <p className={s.coverGuestName}>{guestName ?? "Bapak/Ibu/Saudara/i"}</p>
            </div>
          }
        >
          <div className={s.marquee}>
            <p className={s.marqueeKicker}>Pemutaran perdana</p>
            <h1 className={s.marqueeNames}>
              {groomName}
              <span>&amp;</span>
              {brideName}
            </h1>
            {shortDate ? <p className={s.marqueeDate}>{shortDate}</p> : null}
          </div>
        </Cover>

        <main className={s.main}>
          <section id="awal" className={s.poster}>
            <div className={s.posterFrame}>
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={s.posterImage} src={cover} alt={title} />
              ) : (
                <div className={s.posterBlank} aria-hidden="true" />
              )}
              <span className={s.grain} aria-hidden="true" />
              <div className={s.posterTop}>
                <span className={s.rating} title="Semua umur">
                  SU
                </span>
                <p>Sebuah kisah cinta</p>
              </div>
              <div className={s.posterBottom}>
                <h2 className={s.posterNames}>
                  {groomName}
                  <i>&amp;</i>
                  {brideName}
                </h2>
                <p className={s.posterLine}>{o.posterLine}</p>
                {shortDate ? <p className={s.posterDate}>{shortDate}</p> : null}
                <p className={s.billing}>
                  {families.length ? (
                    <>
                      Keluarga besar {families.join(" bersama keluarga besar ")} mempersembahkan pernikahan{" "}
                      {groom.fullname || groomName} dan {bride.fullname || brideName}
                    </>
                  ) : (
                    <>
                      Mempersembahkan pernikahan {groom.fullname || groomName} dan {bride.fullname || brideName}
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className={`${s.section} ${s.synopsis}`}>
            <Reveal className={s.reveal}>
              <h2 className={s.heading}>Sinopsis</h2>
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

          <section id="mempelai" className={s.section}>
            <h2 className={s.heading}>Pemeran utama</h2>
            <div className={s.cast}>
              <Person person={groom} role="Putra" as="Mempelai pria" />
              <Person person={bride} role="Putri" as="Mempelai wanita" />
            </div>
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={`${s.section} ${s.dark}`}>
              <h2 className={s.heading}>Adegan demi adegan</h2>
              <ol className={s.reel}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.scene} ${s.reveal}`}>
                    <div className={s.frame}>
                      {story.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={mediaUrl(story.image)} alt="" loading="lazy" />
                      ) : (
                        <span className={s.frameEmpty}>Adegan {i + 1}</span>
                      )}
                      <span className={s.grain} aria-hidden="true" />
                    </div>
                    <div className={s.sceneText}>
                      <p className={s.sceneNo}>
                        Adegan {i + 1}
                        {story.date ? <span>{story.date}</span> : null}
                      </p>
                      <h3>{story.title}</h3>
                      {story.description ? <p>{story.description}</p> : null}
                    </div>
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {main ? (
            <section className={`${s.section} ${s.count}`}>
              <h2 className={s.heading}>Tayang dalam</h2>
              <Reveal className={s.reveal}>
                <Countdown
                  target={main.toISOString()}
                  className={s.countdown}
                  itemClassName={s.countItem}
                  doneText="Film kami sudah tayang. Terima kasih sudah ikut menyaksikan."
                />
              </Reveal>
            </section>
          ) : null}

          {content.events.length > 0 ? (
            <section id="acara" className={s.section}>
              <h2 className={s.heading}>Jadwal tayang</h2>
              <div className={s.schedule}>
                {content.events.map((event, i) => (
                  <Showtime key={i} event={event} title={title} />
                ))}
              </div>
            </section>
          ) : null}

          {content.gallery.length > 0 ? (
            <section id="galeri" className={`${s.section} ${s.dark}`}>
              <h2 className={s.heading}>Cuplikan</h2>
              <div className={s.strip}>
                {content.gallery.map((src, i) => (
                  <div key={i} className={s.stripFrame}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaUrl(src)} alt={`Foto ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
              {content.gallery.length > 1 ? <p className={s.stripHint}>Geser untuk melihat cuplikan lain</p> : null}
            </section>
          ) : null}

          {video ? (
            <section className={s.section}>
              <h2 className={s.heading}>Trailer</h2>
              <YoutubeVideo id={video} title={`Video ${title}`} className={s.video} />
            </section>
          ) : null}

          {content.gifts.length > 0 ? (
            <section id="kado" className={s.section}>
              <h2 className={s.heading}>Tanda kasih</h2>
              <p className={s.lead}>
                Doa restu Anda adalah hadiah terindah. Bagi yang ingin memberikan tanda kasih, dapat melalui rekening berikut.
              </p>
              <div className={s.gifts}>
                {content.gifts.map((gift, i) => {
                  const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                  return (
                    <Reveal key={i} className={`${s.gift} ${s.reveal}`}>
                      {logo ? (
                        <span className={s.bankChip}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo} alt={gift.bank} />
                        </span>
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

          <section id="ucapan" className={`${s.section} ${s.dark}`}>
            <h2 className={s.heading}>Konfirmasi kehadiran</h2>
            <p className={s.lead}>Kabari kami apakah Anda akan hadir, dan titipkan doa untuk kami berdua.</p>
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

          <footer className={s.credits}>
            <p className={s.creditsLead}>Terima kasih atas doa dan kehadiran Anda</p>
            {o.greeting === "islami" ? (
              <p className={s.creditsLead}>Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh</p>
            ) : null}
            <p className={s.theEnd}>
              {groomName} <i>&amp;</i> {brideName}
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

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={2600} />
      </div>
    </OpeningProvider>
  );
}

function Person({ person, role, as }: { person: InvitationPerson; role: "Putra" | "Putri"; as: string }) {
  const parents = parentsText(person, role);
  const name = person.fullname || person.name || role;
  return (
    <Reveal className={`${s.person} ${s.reveal}`}>
      <div className={s.portrait}>
        {person.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(person.image)} alt={name} loading="lazy" />
        ) : (
          <span className={s.portraitEmpty}>{(person.name || role).slice(0, 1)}</span>
        )}
        <span className={s.grain} aria-hidden="true" />
      </div>
      <p className={s.role}>sebagai {as}</p>
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

function Showtime({ event, title }: { event: InvitationEvent; title: string }) {
  const d = toDate(event.date, event.startTime);
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  return (
    <Reveal as="article" className={`${s.show} ${s.reveal}`}>
      <div className={s.showDate}>
        {d ? (
          <>
            <span>{part(d, { weekday: "long" })}</span>
            <b>{part(d, { day: "numeric" })}</b>
            <span>{part(d, { month: "long", year: "numeric" })}</span>
          </>
        ) : (
          <span>{date}</span>
        )}
      </div>
      <div className={s.showBody}>
        <h3>{event.title}</h3>
        {time ? <p className={s.showTime}>{time}</p> : null}
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
      </div>
    </Reveal>
  );
}
