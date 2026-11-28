import { DM_Serif_Display, Figtree } from "next/font/google";
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
  youtubeId,
} from "@/lib/invitation/format";
import { resolveOptions } from "../options";
import type { TemplateProps } from "../types";
import manifest from "./manifest";
import { Birds, Cover, HeroStage, Sea } from "./parts";
import s from "./template.module.css";

/** Tema Senja Pantai: langit senja, matahari di garis laut, dan ombak yang bergerak pelan. */

const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--sp-serif" });
const sans = Figtree({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--sp-sans" });

const PALETTE: Record<string, string> = { jingga: s.jingga, lembayung: s.lembayung, toska: s.toska };

const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

export default function SenjaPantai({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const longDate = main ? part(main, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : content.weddingDate;
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const cover = mediaUrl(content.coverImage);
  const video = youtubeId(content.youtubeUrl);

  const items = [
    { id: "awal", label: "Awal" },
    { id: "mempelai", label: "Mempelai" },
    ...(content.stories.length ? [{ id: "cerita", label: "Cerita kami" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Acara" }] : []),
    ...(content.gallery.length ? [{ id: "galeri", label: "Galeri" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
    { id: "ucapan", label: "Konfirmasi" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div
        className={`${s.root} ${PALETTE[o.palette] ?? s.jingga} ${serif.variable} ${sans.variable}`}
        data-waves={o.waves}
      >
        <Cover guest={guestName ?? "Bapak/Ibu/Saudara/i"}>
          <p className={s.coverKicker}>Undangan pernikahan</p>
          <h1 className={s.coverNames}>
            <span>{groomName}</span>
            <i>&amp;</i>
            <span>{brideName}</span>
          </h1>
          {longDate ? <p className={s.coverDate}>{longDate}</p> : null}
        </Cover>

        <main className={s.main}>
          <HeroStage id="awal" className={s.hero}>
            <div className={s.heroScene}>
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={s.heroPhoto} src={cover} alt={title} />
              ) : (
                <div className={s.heroPhoto} />
              )}
              <span className={s.heroGrade} aria-hidden="true" />
              <span className={s.heroGlow} aria-hidden="true" />
              <Birds className={s.heroBirds} />
              <Sea className={s.heroSea} />
              <div className={s.heroTide} aria-hidden="true">
                <span />
              </div>
            </div>
            <div className={s.heroText}>
              <p className={`${s.kicker} ${s.step1}`}>Kami akan menikah</p>
              <h2 className={`${s.heroNames} ${s.step2}`}>
                <span>{groomName}</span>
                <i>&amp;</i>
                <span>{brideName}</span>
              </h2>
              {main ? (
                <div className={`${s.dateRow} ${s.step3}`}>
                  <span>{part(main, { weekday: "long" })}</span>
                  <b>{part(main, { day: "numeric" })}</b>
                  <span>{part(main, { month: "long", year: "numeric" })}</span>
                </div>
              ) : longDate ? (
                <p className={`${s.heroDate} ${s.step3}`}>{longDate}</p>
              ) : null}
            </div>
          </HeroStage>

          <section className={`${s.section} ${s.intro}`}>
            <Reveal className={s.reveal}>
              <Horizon />
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
              <Person person={groom} role="Putra" />
              <Person person={bride} role="Putri" />
            </div>
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={s.section}>
              <Heading>Cerita kami</Heading>
              <ol className={s.stories}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.story} ${s.reveal}`}>
                    <span className={s.storyMark} aria-hidden="true" />
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
              <Heading>Menuju hari bahagia</Heading>
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
              <Heading>Waktu dan tempat</Heading>
              <div className={s.events}>
                {content.events.map((event, i) => (
                  <EventCard key={i} event={event} title={title} />
                ))}
              </div>
            </section>
          ) : null}

          {content.gallery.length > 0 ? (
            <section id="galeri" className={`${s.section} ${s.alt}`}>
              <Heading>Galeri</Heading>
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
            <Heading>Konfirmasi kehadiran</Heading>
            <p className={s.lead}>Kabari kami apakah Anda bisa hadir, dan titipkan doa terbaik untuk kami.</p>
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
            <div className={s.footerSky}>
              <p>Terima kasih atas doa dan kehadiran Anda</p>
              {o.greeting === "islami" ? <p>Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
              <p className={s.footerNames}>
                {groomName} <i>&amp;</i> {brideName}
              </p>
              <span className={s.footerSun} aria-hidden="true" />
            </div>
            <Sea className={s.footerSea} />
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

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={4300} />
      </div>
    </OpeningProvider>
  );
}

/** Ikon judul: matahari setengah di atas dua garis ombak. */
function Horizon() {
  return (
    <svg className={s.horizon} viewBox="0 0 80 44" aria-hidden="true">
      <path className={s.horizonSun} d="M22 28a18 18 0 0 1 36 0Z" />
      <path className={s.horizonLine} d="M4 33q6-4 12 0t12 0t12 0t12 0t12 0t12 0" />
      <path className={s.horizonLine} d="M16 41q6-4 12 0t12 0t12 0t12 0" />
    </svg>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <Reveal className={`${s.heading} ${s.reveal}`}>
      <Horizon />
      <h2>{children}</h2>
    </Reveal>
  );
}

function Person({ person, role }: { person: InvitationPerson; role: "Putra" | "Putri" }) {
  const parents = parentsText(person, role);
  const name = person.fullname || person.name || role;
  return (
    <Reveal className={`${s.person} ${s.reveal}`}>
      <div className={s.portrait}>
        {person.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(person.image)} alt={name} loading="lazy" />
        ) : null}
      </div>
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

function EventCard({ event, title }: { event: InvitationEvent; title: string }) {
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  return (
    <Reveal as="article" className={`${s.event} ${s.reveal}`}>
      <div className={s.eventSky} aria-hidden="true">
        <span />
      </div>
      <div className={s.eventBody}>
        <h3>{event.title}</h3>
        {date ? <p className={s.eventDate}>{date}</p> : null}
        {time ? <p className={s.kicker}>{time}</p> : null}
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
