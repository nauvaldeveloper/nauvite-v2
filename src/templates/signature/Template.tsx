import { Cinzel, Crimson_Pro, Great_Vibes } from "next/font/google";
import Link from "next/link";
import { OpeningProvider } from "@/components/invitation/opening";
import { Countdown } from "@/components/invitation/countdown";
import { CopyButton } from "@/components/invitation/copy-button";
import { IconCalendar, IconPin, SocialIcon } from "@/components/invitation/icons";
import { Reveal } from "@/components/invitation/reveal";
import { WishForm } from "@/components/invitation/wish-form";
import { WishList } from "@/components/invitation/wish-list";
import { YoutubeVideo } from "@/components/invitation/youtube";
import type { InvitationPerson } from "@/lib/invitation/content";
import {
  coupleTitle,
  eventDateText,
  formatLongDate,
  formatTimeRange,
  googleCalendarUrl,
  mainEventDate,
  mediaUrl,
  parentsText,
  bankLogo,
  youtubeId,
} from "@/lib/invitation/format";
import type { TemplateProps } from "../types";
import { BottomNav, Cover, MusicButton, type NavItem } from "./parts";
import s from "./template.module.css";

/**
 * Tampilan tema Signature (Royal Gold, Floral Light, Midnight Dark).
 * Ketiganya memakai tata letak yang sama dengan palet warna berbeda,
 * seperti di Nauvite v1.
 */

const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--sg-script" });
const display = Cinzel({ subsets: ["latin"], weight: ["500", "600"], variable: "--sg-display" });
const body = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--sg-body",
});

export type SignatureVariant = "royal-gold" | "floral-light" | "midnight-dark";

const VARIANT_CLASS: Record<SignatureVariant, string> = {
  "royal-gold": s.royal,
  "floral-light": s.floral,
  "midnight-dark": s.midnight,
};

export default function Signature({
  invitation,
  guestName,
  variant,
}: TemplateProps & { variant: SignatureVariant }) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const dateText = main ? formatLongDate(main) : content.weddingDate;
  const cover = mediaUrl(content.coverImage);
  const video = youtubeId(content.youtubeUrl);

  const nav: NavItem[] = [
    { id: "awal", label: "Awal", icon: "home" },
    { id: "mempelai", label: "Mempelai", icon: "couple" },
    ...(content.events.length ? [{ id: "acara", label: "Acara", icon: "events" } as const] : []),
    ...(content.gallery.length ? [{ id: "galeri", label: "Galeri", icon: "gallery" } as const] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Kado", icon: "gifts" } as const] : []),
    { id: "ucapan", label: "Ucapan", icon: "wishes" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div
        className={`${s.root} ${VARIANT_CLASS[variant]} ${script.variable} ${display.variable} ${body.variable}`}
      >
        <Cover>
          <p className={s.kicker}>Undangan Pernikahan</p>
          {cover ? (
            <div className={s.archPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={title} />
            </div>
          ) : null}
          <h1 className={s.scriptNames}>{title}</h1>
          <Flourish />
          <p className={s.to}>Kepada Yth.</p>
          <p className={s.guestName}>{guestName ?? "Bapak/Ibu/Saudara/i"}</p>
          <p className={s.coverMessage}>
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari pernikahan kami.
          </p>
          {dateText ? <p className={s.coverDate}>{dateText}</p> : null}
        </Cover>

        <main className={s.main}>
          <section id="awal" className={s.hero}>
            <div className={s.heroCard}>
              <p className={s.kicker}>Kami akan menikah</p>
              {cover ? (
                <div className={s.archPhoto}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={title} />
                </div>
              ) : null}
              <h2 className={s.scriptNames}>{title}</h2>
              {dateText ? <p className={s.coverDate}>{dateText}</p> : null}
              <Flourish />
              <p className={s.heroIntro}>
                Dengan memohon rahmat dan ridho Tuhan, kami mengundang Anda untuk menjadi bagian dari hari
                bahagia kami.
              </p>
            </div>
          </section>

          {content.quotes ? (
            <section className={s.section}>
              <Reveal className={`${s.quote} ${s.reveal}`}>
                <blockquote>{content.quotes}</blockquote>
                {content.quotesSource ? <p className={s.quoteSource}>{content.quotesSource}</p> : null}
              </Reveal>
            </section>
          ) : null}

          <section id="mempelai" className={s.section}>
            <Heading>Mempelai</Heading>
            <div className={s.couple}>
              <Person person={groom} role="Putra" />
              <p className={s.ampersand} aria-hidden="true">
                &amp;
              </p>
              <Person person={bride} role="Putri" />
            </div>
          </section>

          {content.stories.length > 0 ? (
            <section className={`${s.section} ${s.alt}`}>
              <Heading>Cerita Cinta Kami</Heading>
              <ol className={s.timeline}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.story} ${s.reveal}`}>
                    {story.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className={s.storyImage} src={mediaUrl(story.image)} alt="" loading="lazy" />
                    ) : null}
                    <div className={s.storyBody}>
                      {story.date ? <p className={s.storyDate}>{story.date}</p> : null}
                      <h3 className={s.cardTitle}>{story.title}</h3>
                      {story.description ? <p>{story.description}</p> : null}
                    </div>
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {main ? (
            <section className={`${s.section} ${s.alt}`}>
              <Heading>Menuju Hari Bahagia</Heading>
              <Countdown target={main.toISOString()} className={s.countdown} itemClassName={s.countdownItem} />
            </section>
          ) : null}

          {content.events.length > 0 ? (
            <section id="acara" className={`${s.section} ${s.alt}`}>
              <Heading>Waktu dan Tempat</Heading>
              <div className={s.cards}>
                {content.events.map((event, i) => {
                  const date = eventDateText(event);
                  const time = formatTimeRange(event);
                  const cal = googleCalendarUrl(event, title);
                  return (
                    <Reveal key={i} className={`${s.card} ${s.eventCard} ${s.reveal}`}>
                      <h3 className={s.eventTitle}>{event.title}</h3>
                      <dl className={s.eventInfo}>
                        {date ? (
                          <div>
                            <dt>Hari dan tanggal</dt>
                            <dd>{date}</dd>
                          </div>
                        ) : null}
                        {time ? (
                          <div>
                            <dt>Waktu</dt>
                            <dd>{time}</dd>
                          </div>
                        ) : null}
                        {event.location || event.address ? (
                          <div>
                            <dt>Tempat</dt>
                            <dd>
                              {event.location}
                              {event.address ? <span className={s.address}>{event.address}</span> : null}
                            </dd>
                          </div>
                        ) : null}
                        {event.entertainment ? (
                          <div>
                            <dt>Hiburan</dt>
                            <dd>{event.entertainment}</dd>
                          </div>
                        ) : null}
                      </dl>
                      <div className={s.actions}>
                        {event.mapsUrl ? (
                          <a className={s.primaryButton} href={event.mapsUrl} target="_blank" rel="noreferrer">
                            <IconPin /> Lihat lokasi
                          </a>
                        ) : null}
                        {cal ? (
                          <a className={s.ghostButton} href={cal} target="_blank" rel="noreferrer">
                            <IconCalendar /> Simpan ke kalender
                          </a>
                        ) : null}
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ) : null}

          {content.gallery.length > 0 ? (
            <section id="galeri" className={s.section}>
              <Heading>Galeri</Heading>
              <div className={s.gallery}>
                {content.gallery.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={mediaUrl(src)} alt={`Foto ${i + 1}`} loading="lazy" />
                ))}
              </div>
            </section>
          ) : null}

          {video ? (
            <section className={`${s.section} ${s.alt}`}>
              <Heading>Video</Heading>
              <YoutubeVideo id={video} title={`Video ${title}`} className={s.video} />
            </section>
          ) : null}

          {content.gifts.length > 0 ? (
            <section id="kado" className={s.section}>
              <Heading>Kado Digital</Heading>
              <p className={s.sectionLead}>
                Doa restu Anda adalah hadiah terindah bagi kami. Bagi yang ingin memberikan tanda kasih, dapat
                melalui rekening berikut.
              </p>
              <div className={s.cards}>
                {content.gifts.map((gift, i) => (
                  <Reveal key={i} className={`${s.card} ${s.giftCard} ${s.reveal}`}>
                    {(() => {
                      const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                      return logo ? (
                        <span className={s.bankChip}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo} alt={gift.bank} />
                        </span>
                      ) : (
                        <p className={s.bankName}>{gift.bank}</p>
                      );
                    })()}
                    <p className={s.accountNumber}>{gift.accountNumber}</p>
                    {gift.accountName ? <p className={s.accountName}>a.n. {gift.accountName}</p> : null}
                    <CopyButton value={gift.accountNumber} className={s.ghostButton} label="Salin nomor rekening" />
                  </Reveal>
                ))}
              </div>
            </section>
          ) : null}

          <section id="ucapan" className={`${s.section} ${s.alt}`}>
            <Heading>Ucapan dan Doa</Heading>
            <p className={s.sectionLead}>Kirimkan doa restu dan konfirmasi kehadiran Anda.</p>
            <div className={`${s.card} ${s.formCard}`}>
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
                  button: s.primaryButton,
                  notice: s.notice,
                }}
              />
            </div>
            <WishList
              slug={slug}
              cls={{
                list: s.wishes,
                item: s.wish,
                name: s.wishName,
                message: s.wishMessage,
                date: s.wishDate,
                empty: s.sectionLead,
              }}
            />
          </section>

          <footer className={s.footer}>
            <p>Terima kasih atas doa restu Anda</p>
            <p className={s.scriptNames}>{title}</p>
            <div className={s.credit}>
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

        <MusicButton />
        <BottomNav items={nav} />
      </div>
    </OpeningProvider>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <div className={s.heading}>
      <h2>{children}</h2>
      <Flourish />
    </div>
  );
}

/** Garis hias tipis di bawah judul. */
function Flourish() {
  return (
    <svg className={s.flourish} viewBox="0 0 160 16" aria-hidden="true">
      <path
        d="M4 8h52c8 0 12-6 18-6s6 6 6 6 0-6 6-6 10 6 18 6h52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Person({ person, role }: { person: InvitationPerson; role: "Putra" | "Putri" }) {
  const parents = parentsText(person, role);
  return (
    <Reveal className={`${s.person} ${s.reveal}`}>
      {person.image ? (
        <div className={s.portrait}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(person.image)} alt={person.fullname || person.name} />
        </div>
      ) : null}
      <h3 className={s.personName}>{person.fullname || person.name}</h3>
      {parents ? (
        <p className={s.parents}>
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
        <a className={s.social} href={person.social.url} target="_blank" rel="noreferrer">
          <SocialIcon kind={person.social.kind} /> @{person.social.handle}
        </a>
      ) : null}
    </Reveal>
  );
}
