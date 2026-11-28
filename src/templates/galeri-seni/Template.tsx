import { Libre_Caslon_Text, Manrope } from "next/font/google";
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

/** Tema Galeri Seni: dinding pameran, lukisan berbingkai emas, lampu sorot, dan plakat museum. */

const serif = Libre_Caslon_Text({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--gs-serif" });
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--gs-sans" });

const PALETTE: Record<string, string> = { putih: s.putih, zamrud: s.zamrud, anggur: s.anggur };
const FRAMES = [s.frameGold, s.frameBlack, s.frameWood];

const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

export default function GaleriSeni({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const longDate = main ? part(main, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : content.weddingDate;
  const year = main ? part(main, { year: "numeric" }) : "";
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const cover = mediaUrl(content.coverImage);
  const video = youtubeId(content.youtubeUrl);

  const items = [
    { id: "awal", label: "Awal" },
    { id: "mempelai", label: "Mempelai" },
    ...(content.stories.length ? [{ id: "cerita", label: "Cerita kami" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Acara" }] : []),
    ...(content.gallery.length ? [{ id: "galeri", label: "Ruang pamer" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
    { id: "ucapan", label: "Buku tamu" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div className={`${s.root} ${PALETTE[o.palette] ?? s.putih} ${serif.variable} ${sans.variable}`}>
        <Cover guest={guestName ?? "Bapak/Ibu/Saudara/i"}>
          <p className={s.kicker}>Pameran tunggal</p>
          <h1 className={s.coverNames}>
            <span>{groomName}</span>
            <i>&amp;</i>
            <span>{brideName}</span>
          </h1>
          <p className={s.coverSub}>Sebuah kisah cinta</p>
          {longDate ? <p className={s.coverDate}>{longDate}</p> : null}
        </Cover>

        <main className={s.main}>
          <HeroStage id="awal" className={s.hero}>
            <span className={s.heroWash} aria-hidden="true" />
            <div className={s.heroTitle}>
              <p className={s.kicker}>Pameran tunggal</p>
              <h2 className={s.heroNames}>
                <span>{groomName}</span>
                <i>&amp;</i>
                <span>{brideName}</span>
              </h2>
            </div>
            <div className={s.painting}>
              <div className={`${s.frame} ${s.frameGold} ${s.frameBig}`}>
                <div className={s.mat}>
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={title} />
                  ) : (
                    <div className={s.blank} />
                  )}
                </div>
              </div>
            </div>
            <div className={s.plaque}>
              <b>
                {groomName} &amp; {brideName}
              </b>
              <span>Indonesia{year ? `, ${year}` : ""}</span>
              {o.artNote ? <i>{o.artNote}</i> : null}
              {longDate ? <span className={s.plaqueDate}>Dibuka {longDate}</span> : null}
            </div>
            <span className={s.heroFloor} aria-hidden="true" />
          </HeroStage>

          <section className={`${s.section} ${s.intro}`}>
            <Reveal className={s.reveal}>
              <p className={s.kicker}>Pengantar</p>
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
              <Person person={groom} role="Putra" as="Mempelai pria" />
              <p className={s.coupleAmp} aria-hidden="true">
                &amp;
              </p>
              <Person person={bride} role="Putri" as="Mempelai wanita" />
            </div>
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={s.section}>
              <Heading>Kisah kami</Heading>
              <ol className={s.stories}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.story} ${s.reveal}`}>
                    {story.image ? (
                      <div className={`${s.frame} ${FRAMES[(i + 1) % FRAMES.length]}`}>
                        <div className={s.mat}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={mediaUrl(story.image)} alt="" loading="lazy" />
                        </div>
                      </div>
                    ) : null}
                    <div className={`${s.label} ${story.image ? s.labelOver : ""}`}>
                      {story.date ? <p className={s.labelKicker}>{story.date}</p> : null}
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
              <Heading>Ruang pamer</Heading>
              <div className={s.gallery}>
                {content.gallery.map((src, i) => (
                  <Reveal key={i} className={`${s.shot} ${s.reveal}`}>
                    <div className={`${s.frame} ${FRAMES[i % FRAMES.length]}`}>
                      <div className={s.mat}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={mediaUrl(src)} alt={`Foto ${i + 1}`} loading="lazy" />
                      </div>
                    </div>
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
            <Heading>Buku tamu</Heading>
            <p className={s.lead}>Kabari kami apakah Anda bisa hadir, dan tuliskan doa terbaik untuk kami.</p>
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
            <p className={s.kicker}>Terima kasih telah berkunjung</p>
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
      <h2>{children}</h2>
    </Reveal>
  );
}

function Person({ person, role, as }: { person: InvitationPerson; role: "Putra" | "Putri"; as: string }) {
  const parents = parentsText(person, role);
  const name = person.fullname || person.name || role;
  return (
    <Reveal className={`${s.person} ${s.reveal}`}>
      <span className={s.personLight} aria-hidden="true" />
      <div className={s.oval}>
        <div className={s.ovalMat}>
          {person.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(person.image)} alt={name} loading="lazy" />
          ) : (
            <div className={s.blank} />
          )}
        </div>
      </div>
      <div className={`${s.label} ${s.personLabel}`}>
        <p className={s.labelKicker}>{as}</p>
        <h3>{name}</h3>
        {parents ? (
          <p>
            {parents.prefix}
            <br />
            {parents.names}
          </p>
        ) : null}
        {person.social ? (
          <a className={s.social} href={person.social.url} target="_blank" rel="noreferrer">
            <SocialIcon kind={person.social.kind} /> @{person.social.handle}
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}

function EventCard({ event, title }: { event: InvitationEvent; title: string }) {
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  return (
    <Reveal as="article" className={`${s.card} ${s.event} ${s.reveal}`}>
      <h3>{event.title}</h3>
      {date ? <p className={s.eventDate}>{date}</p> : null}
      {time ? <p className={s.labelKicker}>{time}</p> : null}
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
