import { Archivo_Narrow, Frank_Ruhl_Libre, Grenze_Gotisch, Source_Serif_4 } from "next/font/google";
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
import { AgendaArt, Cameo, CoverBranch, Feature, Ornament } from "./art";
import { buildCrossword } from "./crossword";
import manifest from "./manifest";
import { Cover, Crossword } from "./parts";
import s from "./template.module.css";

/** Tema Koran Pagi: undangan tanpa foto berbentuk koran. */

const gothic = Grenze_Gotisch({ subsets: ["latin"], weight: "600", variable: "--kp-mast" });
const head = Frank_Ruhl_Libre({ subsets: ["latin"], weight: ["500", "800"], variable: "--kp-head" });
const body = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"], variable: "--kp-body" });
const label = Archivo_Narrow({ subsets: ["latin"], weight: ["500", "700"], variable: "--kp-label" });

const PALETTE: Record<string, string> = { klasik: s.klasik, salem: s.salem, melati: s.melati };

const initial = (name: string, fallback: string) => (name.trim()[0] ?? fallback).toUpperCase();
const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

export default function KoranPagi({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const dateText = main ? formatLongDate(main) : content.weddingDate;
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const gi = initial(groom.name, "P");
  const bi = initial(bride.name, "W");
  const video = youtubeId(content.youtubeUrl);
  const guest = guestName ?? "Tamu Undangan";
  const venue = content.events.find((e) => e.location)?.location;

  const puzzle = o.crossword
    ? buildCrossword([
        { word: groomName.split(" ")[0], clue: "Nama panggilan mempelai pria" },
        { word: brideName.split(" ")[0], clue: "Nama panggilan mempelai wanita" },
        { word: "PERNIKAHAN", clue: "Alasan kita berkumpul" },
        ...(main
          ? [
              { word: part(main, { weekday: "long" }), clue: "Hari acaranya" },
              { word: part(main, { month: "long" }), clue: "Bulan acaranya" },
            ]
          : []),
        { word: "DOA", clue: "Hadiah yang paling ditunggu" },
        { word: "CINTA", clue: "Awal dari semua ini" },
      ])
    : null;

  const masthead = (
    <>
      <p className={s.mastName} data-long={o.masthead.length > 15}>
        {o.masthead}
      </p>
      <p className={s.mastRow}>
        <span>{main ? formatDayDate(main) : "Edisi khusus"}</span>
        <span>Edisi pernikahan</span>
        <span>Harga: doa restu</span>
      </p>
    </>
  );

  const items = [
    { id: "awal", label: "Berita utama" },
    { id: "mempelai", label: "Profil mempelai" },
    ...(content.stories.length ? [{ id: "cerita", label: "Laporan khusus" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Agenda" }] : []),
    ...(puzzle ? [{ id: "tts", label: "Teka-teki silang" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Iklan baris" }] : []),
    { id: "ucapan", label: "Surat pembaca" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div
        className={`${s.root} ${PALETTE[o.palette] ?? s.klasik} ${gothic.variable} ${head.variable} ${body.variable} ${label.variable}`}
      >
        <Cover
          foliage={
            <>
              <CoverBranch className={`${s.foliage} ${s.foliageLeft}`} />
              <CoverBranch className={`${s.foliage} ${s.foliageRight}`} />
            </>
          }
          top={
            <>
              {masthead}
              <h1 className={s.coverHeadline}>
                {groomName} &amp; {brideName} menikah
              </h1>
              {dateText ? <p className={s.coverDate}>{dateText}</p> : null}
            </>
          }
          bottom={
            <>
              <div className={s.coverArt}>
                <Feature left={gi} right={bi} />
              </div>
              <div className={s.coverLines} />
            </>
          }
          band={
            <p>
              <small>Kepada Yth.</small>
              <span data-long={guest.length > 20}>{guest}</span>
            </p>
          }
        />

        <main className={s.main}>
          <section id="awal" className={s.front}>
            <header className={s.masthead}>{masthead}</header>
            <Reveal className={s.headlineWrap}>
              <p className={s.kicker}>Kabar utama</p>
              <h2 className={s.headline}>
                <span>
                  <i>{groomName}</i>
                </span>
                <span>
                  <i>&amp; {brideName}</i>
                </span>
                <span>
                  <i>menikah</i>
                </span>
              </h2>
              {dateText ? (
                <p className={s.deck}>
                  {dateText}
                  {venue ? `, di ${venue}` : ""}
                </p>
              ) : null}
            </Reveal>
            <Reveal className={s.figure}>
              <Feature left={gi} right={bi} />
              <p className={s.caption}>Inisial kedua mempelai, {title}.</p>
            </Reveal>
            <Reveal className={`${s.article} ${s.reveal}`}>
              {o.greeting === "islami" ? <p className={s.salam}>Assalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
              <p className={s.dear}>Untuk {guestName ?? "Bapak/Ibu/Saudara/i"}.</p>
              <div className={s.columns}>
                {o.lead.split(/\n\s*\n/).map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </Reveal>
          </section>

          {content.quotes ? (
            <section className={s.section}>
              <Reveal className={`${s.quote} ${s.reveal}`}>
                <blockquote>{content.quotes}</blockquote>
                {content.quotesSource ? <p>{content.quotesSource}</p> : null}
              </Reveal>
            </section>
          ) : null}

          <section id="mempelai" className={s.section}>
            <Rubric>Profil mempelai</Rubric>
            <div className={s.profiles}>
              <Profile person={groom} role="Putra" letter={gi} />
              <Profile person={bride} role="Putri" letter={bi} flip />
            </div>
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={s.section}>
              <Rubric>Laporan khusus</Rubric>
              <ol className={s.stories}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={s.reveal}>
                    {story.date ? <p className={s.kicker}>{story.date}</p> : null}
                    <h3>{story.title}</h3>
                    {story.description ? <p className={s.storyText}>{story.description}</p> : null}
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {main ? (
            <section className={s.countSection}>
              <Reveal className={s.reveal}>
                <p>Naik cetak dalam</p>
                <Countdown
                  target={main.toISOString()}
                  className={s.countdown}
                  itemClassName={s.countItem}
                  doneText="Kabar ini sudah terjadi. Terima kasih atas doanya."
                />
              </Reveal>
            </section>
          ) : null}

          {content.events.length > 0 ? (
            <section id="acara" className={s.section}>
              <Rubric>Agenda</Rubric>
              <div className={s.agenda}>
                {content.events.map((event, i) => (
                  <Agenda key={i} event={event} index={i} title={title} />
                ))}
              </div>
            </section>
          ) : null}

          {puzzle ? (
            <section id="tts" className={s.section}>
              <Rubric>Teka-teki silang</Rubric>
              <Reveal className={`${s.puzzle} ${s.reveal}`}>
                <p className={s.lead}>Sambil menunggu harinya, coba isi kotak ini.</p>
                <Crossword puzzle={puzzle} />
              </Reveal>
            </section>
          ) : null}

          {video ? (
            <section className={s.section}>
              <Rubric>Tayangan</Rubric>
              <YoutubeVideo id={video} title={`Video ${title}`} />
            </section>
          ) : null}

          {content.gifts.length > 0 ? (
            <section id="kado" className={s.section}>
              <Rubric>Iklan baris</Rubric>
              <p className={s.lead}>Doa Anda sudah lebih dari cukup. Bagi yang ingin mengirim tanda kasih:</p>
              <div className={s.ads}>
                {content.gifts.map((gift, i) => {
                  const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                  return (
                    <Reveal key={i} className={`${s.ad} ${s.reveal}`}>
                      {logo ? (
                        <span className={s.bank}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo} alt={gift.bank} />
                        </span>
                      ) : (
                        <p>
                          <b>{gift.bank}</b>
                        </p>
                      )}
                      <p className={s.account}>{gift.accountNumber}</p>
                      {gift.accountName ? <p>a.n. {gift.accountName}</p> : null}
                      <CopyButton value={gift.accountNumber} className={s.ghost} label="Salin nomor" />
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section id="ucapan" className={s.section}>
            <Rubric>Surat pembaca</Rubric>
            <p className={s.lead}>Kabari kami apakah Anda bisa datang, dan tulis doa untuk dimuat di sini.</p>
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
            <Ornament />
            <p>Terima kasih sudah membaca sampai halaman terakhir. Sampai bertemu di hari bahagia kami.</p>
            {o.greeting === "islami" ? <p>Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
            <p className={s.footerNames}>{title}</p>
            {invitation.partner?.name ? (
              <p className={s.credit}>
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
            <p className={s.credit}>
              Dicetak oleh <Link href="/">Nauvite</Link>
            </p>
          </footer>
        </main>

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={6000} />
      </div>
    </OpeningProvider>
  );
}

function Rubric({ children }: { children: string }) {
  return (
    <Reveal className={s.rubric}>
      <h2>{children}</h2>
    </Reveal>
  );
}

function Profile({
  person,
  role,
  letter,
  flip,
}: {
  person: InvitationPerson;
  role: "Putra" | "Putri";
  letter: string;
  flip?: boolean;
}) {
  const parents = parentsText(person, role);
  return (
    <Reveal className={`${s.profile} ${s.reveal}`}>
      <Cameo letter={letter} flip={flip} />
      <h3>{person.fullname || person.name}</h3>
      {parents ? (
        <p>
          {parents.prefix} {parents.names}
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

/** Satu acara sebagai kupon agenda. */
function Agenda({ event, index, title }: { event: InvitationEvent; index: number; title: string }) {
  const d = toDate(event.date, event.startTime);
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  return (
    <Reveal as="article" className={`${s.coupon} ${s.reveal}`}>
      <AgendaArt index={index} />
      <h3>{event.title}</h3>
      <div className={s.couponInfo}>
        {d ? (
          <p className={s.couponDate} aria-hidden="true">
            <b>{part(d, { day: "numeric" })}</b>
            {part(d, { month: "long" })}
          </p>
        ) : null}
        <div>
          {date ? <p>{date}</p> : null}
          {time ? <p>{time}</p> : null}
          {event.location ? (
            <p>
              <b>{event.location}</b>
            </p>
          ) : null}
          {event.address ? <p>{event.address}</p> : null}
          {event.entertainment ? <p>Hiburan: {event.entertainment}</p> : null}
        </div>
      </div>
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
