import { Cormorant, Jost } from "next/font/google";
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
import { Cover, HeroStage } from "./parts";
import s from "./template.module.css";

/** Tema Lengkung Boho: warna tanah, foto berbingkai lengkung, matahari, dan pelangi boho. */

const serif = Cormorant({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--lb-serif" });
const sans = Jost({ subsets: ["latin"], weight: ["400", "500"], variable: "--lb-sans" });

const PALETTE: Record<string, string> = { terakota: s.terakota, zaitun: s.zaitun, mawar: s.mawar };
const SHAPES = [s.shapeArch, s.shapeCircle, s.shapeSoft];

const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

export default function LengkungBoho({ invitation, guestName }: TemplateProps) {
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
      <div className={`${s.root} ${PALETTE[o.palette] ?? s.terakota} ${serif.variable} ${sans.variable}`}>
        <Cover photo={cover}>
          <p className={s.kicker}>Undangan pernikahan</p>
          <h1 className={s.coverNames}>
            {groomName} <i>&amp;</i> {brideName}
          </h1>
          <p className={s.coverTo}>Kepada Yth.</p>
          <p className={s.coverGuest}>{guestName ?? "Bapak/Ibu/Saudara/i"}</p>
        </Cover>

        <main className={s.main}>
          <HeroStage id="awal" className={s.hero}>
            <div className={s.heroArt}>
              <span className={s.sun} aria-hidden="true" />
              <div className={`${s.arch} ${s.heroArch}`}>
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={title} />
                ) : null}
              </div>
            </div>
            <div className={s.heroText}>
              <p className={s.kicker}>Pernikahan</p>
              <h2 className={s.heroNames}>
                {groomName}
                <i>&amp;</i>
                {brideName}
              </h2>
              {longDate ? <p className={s.heroDate}>{longDate}</p> : null}
            </div>
          </HeroStage>

          <section className={`${s.section} ${s.intro}`}>
            <Reveal className={s.reveal}>
              <Rainbow />
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
                    {story.image ? (
                      <div className={`${s.arch} ${s.storyArch}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={mediaUrl(story.image)} alt="" loading="lazy" />
                      </div>
                    ) : null}
                    <div className={s.storyText}>
                      {story.date ? <p className={s.kicker}>{story.date}</p> : null}
                      <h3>{story.title}</h3>
                      {story.description ? <p>{story.description}</p> : null}
                    </div>
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
                  <Reveal key={i} className={`${s.shot} ${SHAPES[i % SHAPES.length]} ${s.reveal}`}>
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
            <Rainbow />
            <p>Terima kasih atas doa dan kehadiran Anda</p>
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

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={4000} />
      </div>
    </OpeningProvider>
  );
}

/** Pelangi boho: tiga lengkung bertumpuk yang tergambar pelan saat muncul. */
function Rainbow() {
  return (
    <svg className={s.rainbow} viewBox="0 0 120 64" aria-hidden="true">
      <path d="M8 62a52 52 0 0 1 104 0" style={{ stroke: "var(--c1)" }} />
      <path d="M24 62a36 36 0 0 1 72 0" style={{ stroke: "var(--c2)" }} />
      <path d="M40 62a20 20 0 0 1 40 0" style={{ stroke: "var(--c3)" }} />
    </svg>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <Reveal className={`${s.heading} ${s.reveal}`}>
      <Rainbow />
      <h2>{children}</h2>
    </Reveal>
  );
}

function Person({ person, role }: { person: InvitationPerson; role: "Putra" | "Putri" }) {
  const parents = parentsText(person, role);
  const name = person.fullname || person.name || role;
  return (
    <Reveal className={`${s.person} ${s.reveal}`}>
      <div className={`${s.arch} ${s.portrait}`}>
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
    </Reveal>
  );
}
