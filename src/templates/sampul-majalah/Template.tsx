import { Archivo, Archivo_Narrow, Playfair_Display } from "next/font/google";
import Link from "next/link";
import type { CSSProperties } from "react";
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

/** Tema Sampul Majalah: sampul edisi spesial dan halaman dalam ala majalah mode. */

const display = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"], style: ["normal", "italic"], variable: "--sm-display" });
const body = Archivo({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--sm-body" });
const narrow = Archivo_Narrow({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--sm-narrow" });

const PALETTE: Record<string, string> = { merah: s.merah, monokrom: s.monokrom, "merah-muda": s.merahMuda };

const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

export default function SampulMajalah({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const longDate = main ? part(main, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : content.weddingDate;
  const issue = main ? part(main, { month: "long", year: "numeric" }) : "";
  const code = main ? part(main, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\D/g, "") : "00000000";
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const cover = mediaUrl(content.coverImage);
  const video = youtubeId(content.youtubeUrl);
  const magazine = (o.magazine || "Bahagia").trim();
  const place = content.events[0]?.location;
  const guest = guestName ?? "Bapak/Ibu/Saudara/i";

  const names = (
    <>
      {groomName} <i>&amp;</i> {brideName}
    </>
  );

  const items = [
    { id: "awal", label: "Sampul" },
    { id: "mempelai", label: "Profil" },
    ...(content.stories.length ? [{ id: "cerita", label: "Liputan" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Agenda" }] : []),
    ...(content.gallery.length ? [{ id: "galeri", label: "Pemotretan" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
    { id: "ucapan", label: "Surat pembaca" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div className={`${s.root} ${PALETTE[o.palette] ?? s.merah} ${display.variable} ${body.variable} ${narrow.variable}`}>
        <Cover magazine={magazine} photo={cover} names={names} line={o.coverLine} date={issue} guest={guest} />

        <main className={s.main}>
          <HeroStage id="awal" className={s.hero} style={{ "--len": Math.max(magazine.length, 4) } as CSSProperties}>
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={s.heroPhoto} src={cover} alt={title} />
            ) : (
              <div className={s.heroPhoto} />
            )}
            <span className={s.heroShade} aria-hidden="true" />
            <h1 className={s.masthead}>{magazine}</h1>
            <p className={s.issue}>
              <span>Edisi spesial pernikahan</span>
              <span>{issue}</span>
            </p>
            <span className={s.badge} aria-hidden="true">
              Edisi
              <br />
              terbatas
            </span>
            <div className={s.coverLines}>
              <span className={s.exclusive}>Eksklusif</span>
              <h2 className={s.heroNames}>{names}</h2>
              {o.coverLine ? <p className={s.heroLine}>{o.coverLine}</p> : null}
            </div>
            <div className={s.heroFoot}>
              <dl className={s.sideLines}>
                {longDate ? (
                  <div>
                    <dt>Hari besar</dt>
                    <dd>{longDate}</dd>
                  </div>
                ) : null}
                {place ? (
                  <div>
                    <dt>Lokasi</dt>
                    <dd>{place}</dd>
                  </div>
                ) : null}
              </dl>
              <div className={s.barcodeBox} aria-hidden="true">
                <span className={s.barcode} />
                <span className={s.barcodeNum}>{code}</span>
                <span className={s.price}>Gratis untuk Anda</span>
              </div>
            </div>
          </HeroStage>

          <section className={`${s.section} ${s.letter}`}>
            <Reveal className={s.reveal}>
              <p className={s.kicker}>Dari kami</p>
              <h2 className={s.sectionTitle}>Surat untuk {guest}</h2>
              {o.greeting === "islami" ? <p className={s.salam}>Assalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
              <div className={s.letterBody}>
                {o.opening.split(/\n\s*\n/).map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
              <p className={s.signature}>
                {groomName} &amp; {brideName}
              </p>
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
            <Heading kicker="Profil">Mempelai</Heading>
            <div className={s.couple}>
              <Person person={groom} role="Putra" as="Mempelai pria" />
              <Person person={bride} role="Putri" as="Mempelai wanita" />
            </div>
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={s.section}>
              <Heading kicker="Liputan khusus">Perjalanan cinta kami</Heading>
              <ol className={s.stories}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.story} ${s.reveal}`}>
                    {story.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className={s.storyPhoto} src={mediaUrl(story.image)} alt="" loading="lazy" />
                    ) : null}
                    {story.date ? <p className={s.kicker}>{story.date}</p> : null}
                    <h3>{story.title}</h3>
                    {story.description ? <p className={s.storyBody}>{story.description}</p> : null}
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {main ? (
            <section className={`${s.section} ${s.band}`}>
              <Heading kicker="Hitung mundur">Menuju hari besar</Heading>
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
              <Heading kicker="Agenda">Waktu dan tempat</Heading>
              <div className={s.events}>
                {content.events.map((event, i) => (
                  <EventCard key={i} event={event} title={title} />
                ))}
              </div>
            </section>
          ) : null}

          {content.gallery.length > 0 ? (
            <section id="galeri" className={`${s.section} ${s.alt}`}>
              <Heading kicker="Di balik layar">Sesi pemotretan</Heading>
              <div className={s.gallery}>
                {content.gallery.map((src, i) => (
                  <Reveal key={i} className={`${s.shot} ${s.reveal}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaUrl(src)} alt={`Foto ${i + 1}`} loading="lazy" />
                  </Reveal>
                ))}
              </div>
            </section>
          ) : null}

          {video ? (
            <section className={s.section}>
              <Heading kicker="Tonton">Video</Heading>
              <YoutubeVideo id={video} title={`Video ${title}`} className={s.video} />
            </section>
          ) : null}

          {content.gifts.length > 0 ? (
            <section id="kado" className={s.section}>
              <Heading kicker="Hadiah">Tanda kasih</Heading>
              <p className={s.lead}>
                Doa restu Anda adalah hadiah terindah. Bagi yang ingin memberikan tanda kasih, dapat melalui rekening berikut.
              </p>
              <div className={s.gifts}>
                {content.gifts.map((gift, i) => {
                  const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                  return (
                    <Reveal key={i} className={`${s.gift} ${s.reveal}`}>
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
            <Heading kicker="Surat pembaca">Konfirmasi kehadiran</Heading>
            <p className={s.lead}>Kabari kami apakah Anda bisa hadir, dan kirimkan doa terbaik untuk kami.</p>
            <div className={s.formBox}>
              <WishForm
                slug={slug}
                defaultName={guestName ?? undefined}
                cls={{
                  form: s.form,
                  field: s.field,
                  label: s.formLabel,
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
            <p className={s.footerMast}>{magazine}</p>
            <p className={s.kicker}>Terima kasih telah membaca</p>
            {o.greeting === "islami" ? <p>Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
            <p className={s.footerNames}>{names}</p>
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

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={4000} />
      </div>
    </OpeningProvider>
  );
}

function Heading({ kicker, children }: { kicker: string; children: string }) {
  return (
    <Reveal className={`${s.heading} ${s.reveal}`}>
      <p className={s.kicker}>{kicker}</p>
      <h2>{children}</h2>
    </Reveal>
  );
}

function Person({ person, role, as }: { person: InvitationPerson; role: "Putra" | "Putri"; as: string }) {
  const parents = parentsText(person, role);
  const name = person.fullname || person.name || role;
  return (
    <Reveal className={`${s.person} ${s.reveal}`}>
      <div className={s.personPhoto}>
        {person.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(person.image)} alt={name} loading="lazy" />
        ) : null}
        <div className={s.personOverlay}>
          <span className={s.exclusive}>{as}</span>
          <h3>{name}</h3>
        </div>
      </div>
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

function EventCard({ event, title }: { event: InvitationEvent; title: string }) {
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  return (
    <Reveal as="article" className={`${s.event} ${s.reveal}`}>
      <h3>{event.title}</h3>
      <dl className={s.eventGrid}>
        {date ? (
          <div>
            <dt>Tanggal</dt>
            <dd>{date}</dd>
          </div>
        ) : null}
        {time ? (
          <div>
            <dt>Waktu</dt>
            <dd>{time}</dd>
          </div>
        ) : null}
        {event.location ? (
          <div className={s.wide}>
            <dt>Tempat</dt>
            <dd>{event.location}</dd>
          </div>
        ) : null}
      </dl>
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
