import { IBM_Plex_Mono, Work_Sans, Young_Serif } from "next/font/google";
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
import { Cover, HeroStage, MapBackdrop, Plane } from "./parts";
import s from "./template.module.css";

/** Tema Paspor Cinta: paspor kulit, halaman data, stempel imigrasi, dan boarding pass. */

const serif = Young_Serif({ subsets: ["latin"], weight: "400", variable: "--pc-serif" });
const sans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--pc-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--pc-mono" });

const PALETTE: Record<string, string> = { biru: s.biru, merah: s.merah, hijau: s.hijau };
const TILT = [-3, 2.5, -1.5, 3, -2];
const tilt = (i: number) => ({ "--tilt": `${TILT[i % TILT.length]}deg` }) as CSSProperties;

const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

/** Baris kode ala paspor: huruf besar, spasi jadi "<", panjang tetap. */
const mrz = (text: string, len = 34) =>
  (text.toUpperCase().replace(/[^A-Z0-9<]+/g, "<") + "<".repeat(len)).slice(0, len);

export default function PasporCinta({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const longDate = main ? part(main, { day: "numeric", month: "long", year: "numeric" }) : content.weddingDate;
  const stampDate = main ? part(main, { day: "2-digit", month: "short", year: "numeric" }).toUpperCase().replace(/\./g, "") : "";
  const code = main ? part(main, { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\D/g, "") : "000000";
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const cover = mediaUrl(content.coverImage);
  const video = youtubeId(content.youtubeUrl);
  const place = content.events[0]?.location;

  const items = [
    { id: "awal", label: "Awal" },
    { id: "mempelai", label: "Penumpang" },
    ...(content.stories.length ? [{ id: "cerita", label: "Perjalanan" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Acara" }] : []),
    ...(content.gallery.length ? [{ id: "galeri", label: "Album" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
    { id: "ucapan", label: "Check-in" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div className={`${s.root} ${PALETTE[o.palette] ?? s.biru} ${serif.variable} ${sans.variable} ${mono.variable}`}>
        <Cover
          guest={guestName ?? "Bapak/Ibu/Saudara/i"}
          names={
            <>
              <span>{groomName}</span>
              <i>&amp;</i>
              <span>{brideName}</span>
            </>
          }
        />

        <main className={s.main}>
          <HeroStage id="awal" className={s.hero}>
            <MapBackdrop className={s.heroMap} />
            <div className={s.heroTitle}>
              <p className={s.kicker}>Paspor pernikahan</p>
              <h2 className={s.heroNames}>
                <span>{groomName}</span>
                <i>&amp;</i>
                <span>{brideName}</span>
              </h2>
            </div>
            <div className={s.dataPage}>
              <div className={s.pageHead}>
                <span>Paspor pernikahan</span>
                <span>Kode NVT</span>
              </div>
              <div className={s.pageBody}>
                <div className={s.passPhoto}>
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={title} />
                  ) : null}
                </div>
                <dl className={s.fields}>
                  <div>
                    <dt>Nama</dt>
                    <dd>
                      {groomName} &amp; {brideName}
                    </dd>
                  </div>
                  {longDate ? (
                    <div>
                      <dt>Tanggal berangkat</dt>
                      <dd>{longDate}</dd>
                    </div>
                  ) : null}
                  {o.destination ? (
                    <div>
                      <dt>Tujuan</dt>
                      <dd>{o.destination}</dd>
                    </div>
                  ) : null}
                  {place ? (
                    <div>
                      <dt>Tempat</dt>
                      <dd>{place}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>No. paspor</dt>
                    <dd className={s.mono}>NV{code}</dd>
                  </div>
                </dl>
              </div>
              <div className={s.mrz} aria-hidden="true">
                <p>{mrz(`P<NVT${groomName}<<${brideName}`)}</p>
                <p>{mrz(`NV${code}<<MENIKAH<<${o.destination}`)}</p>
              </div>
              <span className={`${s.stamp} ${s.stampArrive}`} aria-hidden="true">
                <small>Tiba</small>
                <b>{stampDate || "HARI H"}</b>
                <small>Nauvite</small>
              </span>
              <span className={`${s.stamp} ${s.stampOk}`} aria-hidden="true">
                Disetujui
              </span>
              <span className={`${s.stamp} ${s.stampHappy}`} aria-hidden="true">
                <Plane /> Bahagia
              </span>
            </div>
          </HeroStage>

          <section className={`${s.section} ${s.intro}`}>
            <Reveal className={s.reveal}>
              <p className={s.kicker}>Pesan dari kami</p>
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
            <Heading>Data penumpang</Heading>
            <div className={s.couple}>
              <Person person={groom} role="Putra" as="Mempelai pria" i={0} />
              <Person person={bride} role="Putri" as="Mempelai wanita" i={1} />
            </div>
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={s.section}>
              <Heading>Jejak perjalanan</Heading>
              <ol className={s.stories}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.story} ${s.reveal}`}>
                    <span className={s.storyMark} aria-hidden="true">
                      <Plane />
                    </span>
                    {story.image ? (
                      <figure className={s.postcard} style={tilt(i)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={mediaUrl(story.image)} alt="" loading="lazy" />
                        {story.date ? <span className={s.postmark}>{story.date}</span> : null}
                      </figure>
                    ) : null}
                    {story.date && !story.image ? <p className={s.monoLabel}>{story.date}</p> : null}
                    <h3>{story.title}</h3>
                    {story.description ? <p className={s.storyBody}>{story.description}</p> : null}
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {main ? (
            <section className={`${s.section} ${s.board}`}>
              <Heading>Menuju keberangkatan</Heading>
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
              <Heading>Boarding pass</Heading>
              <div className={s.events}>
                {content.events.map((event, i) => (
                  <EventCard key={i} event={event} title={title} guest={guestName ?? "Tamu undangan"} />
                ))}
              </div>
            </section>
          ) : null}

          {content.gallery.length > 0 ? (
            <section id="galeri" className={`${s.section} ${s.alt}`}>
              <Heading>Album perjalanan</Heading>
              <div className={s.gallery}>
                {content.gallery.map((src, i) => (
                  <Reveal key={i} className={`${s.shot} ${s.reveal}`} style={tilt(i + 2)}>
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
                    <Reveal key={i} className={`${s.card} ${s.gift} ${s.reveal}`}>
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
            <Heading>Check-in kehadiran</Heading>
            <p className={s.lead}>Kabari kami apakah Anda ikut dalam perjalanan ini, dan titipkan doa terbaik untuk kami.</p>
            <div className={`${s.card} ${s.formBox}`}>
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
              cls={{ list: s.wishes, item: `${s.card} ${s.wish}`, name: s.wishName, message: s.wishMessage, date: s.wishDate, empty: s.lead }}
            />
          </section>

          <footer className={s.footer}>
            <Plane className={s.footerPlane} />
            <p className={s.kicker}>Sampai jumpa di tujuan</p>
            {o.greeting === "islami" ? <p>Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
            <p className={s.footerNames}>
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

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={4300} />
      </div>
    </OpeningProvider>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <Reveal className={`${s.heading} ${s.reveal}`}>
      <Plane className={s.headingPlane} />
      <h2>{children}</h2>
    </Reveal>
  );
}

function Person({ person, role, as, i }: { person: InvitationPerson; role: "Putra" | "Putri"; as: string; i: number }) {
  const parents = parentsText(person, role);
  const name = person.fullname || person.name || role;
  return (
    <Reveal className={`${s.card} ${s.idCard} ${s.reveal}`} style={tilt(i)}>
      <div className={s.idHead}>
        <span>Kartu penumpang</span>
        <span>{as}</span>
      </div>
      <div className={s.idPhoto}>
        {person.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(person.image)} alt={name} loading="lazy" />
        ) : null}
      </div>
      <dl className={s.fields}>
        <div>
          <dt>Nama lengkap</dt>
          <dd className={s.idName}>{name}</dd>
        </div>
        {parents ? (
          <div>
            <dt>{parents.prefix}</dt>
            <dd>{parents.names}</dd>
          </div>
        ) : null}
      </dl>
      {person.social ? (
        <a className={s.social} href={person.social.url} target="_blank" rel="noreferrer">
          <SocialIcon kind={person.social.kind} /> @{person.social.handle}
        </a>
      ) : null}
    </Reveal>
  );
}

function EventCard({ event, title, guest }: { event: InvitationEvent; title: string; guest: string }) {
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  return (
    <Reveal as="article" className={`${s.pass} ${s.reveal}`}>
      <div className={s.passHead}>
        <span>
          <Plane /> Boarding pass
        </span>
        <span>{event.title}</span>
      </div>
      <div className={s.passBody}>
        <h3>{event.title}</h3>
        <dl className={s.passGrid}>
          <div>
            <dt>Penumpang</dt>
            <dd>{guest}</dd>
          </div>
          {date ? (
            <div>
              <dt>Tanggal</dt>
              <dd>{date}</dd>
            </div>
          ) : null}
          {time ? (
            <div>
              <dt>Boarding</dt>
              <dd>{time}</dd>
            </div>
          ) : null}
          {event.location ? (
            <div className={s.passWide}>
              <dt>Gerbang</dt>
              <dd>{event.location}</dd>
            </div>
          ) : null}
        </dl>
        {event.address ? <p className={s.address}>{event.address}</p> : null}
        {event.entertainment ? <p className={s.address}>Hiburan: {event.entertainment}</p> : null}
      </div>
      <div className={s.passStub}>
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
        <span className={s.barcode} aria-hidden="true" />
      </div>
    </Reveal>
  );
}
