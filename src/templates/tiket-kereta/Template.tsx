import { Barlow, Barlow_Condensed, Besley } from "next/font/google";
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
import { Barcode, Guilloche, HEART, SeatMap, seatOf, ticketNo, Train } from "./art";
import manifest from "./manifest";
import { Board, Cover, Platform, Route } from "./parts";
import s from "./template.module.css";

/** Tema Tiket Kereta: undangan tanpa foto dari karcis, papan keberangkatan, dan rute perjalanan. */

const head = Besley({ subsets: ["latin"], weight: ["500", "700"], variable: "--tk-head" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--tk-body" });
const cond = Barlow_Condensed({ subsets: ["latin"], weight: ["600"], variable: "--tk-cond" });

const PALETTE: Record<string, string> = { jingga: s.jingga, biru: s.biru, jambu: s.jambu };

const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

/** Huruf papan hanya kapital tanpa aksen. */
const boardText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

export default function TiketKereta({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const dateText = main ? formatLongDate(main) : content.weddingDate;
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const pair = groomName + brideName;
  const video = youtubeId(content.youtubeUrl);
  const guest = guestName ?? "Tamu Undangan";
  const seat = guestName ? seatOf(guestName) : null;
  const number = ticketNo(pair + guest);
  const rows = [
    { label: "Penumpang", text: boardText(groomName) },
    { label: "Bersama", text: boardText(brideName) },
    ...(main ? [{ label: "Tanggal", text: boardText(part(main, { day: "2-digit", month: "short", year: "numeric" })) }] : []),
    { label: "Tujuan", text: "PELAMINAN" },
  ];
  const cols = Math.max(11, ...rows.map((row) => row.text.length));

  const items = [
    { id: "awal", label: "Awal" },
    { id: "mempelai", label: "Mempelai" },
    ...(content.stories.length ? [{ id: "cerita", label: "Rute kami" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Jadwal acara" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
    { id: "ucapan", label: "Konfirmasi" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div className={`${s.root} ${PALETTE[o.palette] ?? s.jingga} ${head.variable} ${body.variable} ${cond.variable}`}>
        <Cover
          ticket={
            <>
              <Guilloche />
              <p className={s.ticketKind}>
                Karcis
                <span>undangan pernikahan</span>
              </p>
              <h1 data-long={Math.max(groomName.length, brideName.length) > 9}>
                {groomName}
                <span className={s.relation} aria-hidden="true" />
                <span className={s.srOnly}> dan </span>
                {brideName}
              </h1>
              <Train first={groomName} second={brideName} className={s.coverTrain} />
              <dl className={s.ticketInfo}>
                {main ? (
                  <div>
                    <dt>Berangkat</dt>
                    <dd>{part(main, { day: "numeric", month: "short", year: "numeric" })}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Tujuan</dt>
                  <dd>Pelaminan</dd>
                </div>
              </dl>
            </>
          }
          stub={
            <>
              <Guilloche />
              <p>
                Untuk penumpang
                <b data-long={guest.length > 20}>{guest}</b>
              </p>
              <div className={s.stubCode}>
                <Barcode text={number} />
                <span>{number}</span>
              </div>
            </>
          }
        />

        <main className={s.main}>
          <section id="awal" className={s.hero}>
            <div className={s.board}>
              <p className={s.boardTitle}>Keberangkatan</p>
              <Board rows={rows} cols={cols} />
            </div>
            <Reveal className={`${s.heroText} ${s.reveal}`}>
              <p>Kami akan menikah</p>
              <h2 className={s.names}>
                {groomName} <i>&amp;</i> {brideName}
              </h2>
              {dateText ? <p className={s.heroDate}>{dateText}</p> : null}
            </Reveal>
            <Platform>
              <Train first={groomName} second={brideName} />
            </Platform>
          </section>

          <section className={`${s.section} ${s.letter}`}>
            <Reveal className={s.reveal}>
              {o.greeting === "islami" ? <p>Assalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
              <p className={s.to}>Untuk {guestName ?? "Bapak/Ibu/Saudara/i"},</p>
              {o.opening.split(/\n\s*\n/).map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </Reveal>
            {o.guestSeat && seat ? (
              <Reveal className={`${s.ticket} ${s.seatCard}`}>
                <div className={s.seatTop}>
                  <p className={s.to}>{guestName}</p>
                  <dl className={s.ticketInfo}>
                    <div>
                      <dt>Gerbong</dt>
                      <dd>{seat.coach}</dd>
                    </div>
                    <div>
                      <dt>Kursi</dt>
                      <dd>{seat.label}</dd>
                    </div>
                  </dl>
                </div>
                <SeatMap row={seat.row} col={seat.col} />
                <p className={s.seatNote}>Nomor ini dibuat dari nama Anda sebagai kenang-kenangan. Di acara nanti, silakan duduk di mana saja.</p>
              </Reveal>
            ) : null}
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
            <h2 className={s.heading}>Mempelai</h2>
            <Person person={groom} role="Putra" next={brideName} />
            <Person person={bride} role="Putri" next="Pelaminan" />
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={`${s.section} ${s.band}`}>
              <h2 className={s.heading}>Rute kami</h2>
              <Route>
                <ol className={s.stops}>
                  {content.stories.map((story, i) => (
                    <Reveal as="li" key={i} className={`${s.stop} ${s.reveal}`}>
                      {story.date ? <p className={s.stopDate}>{story.date}</p> : null}
                      <h3>{story.title}</h3>
                      {story.description ? <p>{story.description}</p> : null}
                    </Reveal>
                  ))}
                  <li className={`${s.stop} ${s.lastStop}`}>
                    <h3>Pelaminan</h3>
                    {dateText ? <p>{dateText}</p> : null}
                  </li>
                </ol>
              </Route>
            </section>
          ) : null}

          {main ? (
            <section className={`${s.section} ${s.count}`}>
              <h2 className={s.heading}>Berangkat dalam</h2>
              <Reveal className={s.reveal}>
                <Countdown
                  target={main.toISOString()}
                  className={s.countdown}
                  itemClassName={s.countItem}
                  doneText="Kereta kami sudah berangkat. Terima kasih atas doanya."
                />
              </Reveal>
            </section>
          ) : null}

          {content.events.length > 0 ? (
            <section id="acara" className={s.section}>
              <h2 className={s.heading}>Jadwal acara</h2>
              <div className={s.list}>
                {content.events.map((event, i) => (
                  <EventTicket key={i} event={event} title={title} />
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
              <p className={s.lead}>Doa Anda sudah lebih dari cukup. Bagi yang ingin menitipkan bekal perjalanan:</p>
              <div className={s.tags}>
                {content.gifts.map((gift, i) => {
                  const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                  return (
                    <Reveal key={i} className={`${s.luggage} ${s.reveal}`}>
                      <div>
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt={gift.bank} />
                        ) : (
                          <b>{gift.bank}</b>
                        )}
                        <p className={s.account}>{gift.accountNumber}</p>
                        {gift.accountName ? <p>a.n. {gift.accountName}</p> : null}
                        <CopyButton value={gift.accountNumber} className={s.ghost} label="Salin nomor" />
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section id="ucapan" className={`${s.section} ${s.band}`}>
            <h2 className={s.heading}>Konfirmasi kehadiran</h2>
            <p className={s.lead}>Kabari kami apakah Anda ikut mengantar, dan titipkan doa untuk perjalanan kami.</p>
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
            <Reveal className={s.footerArt}>
              <Train first={groomName} second={brideName} run />
            </Reveal>
            <p>Terima kasih sudah mengantar kami. Sampai jumpa di peron.</p>
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
              Dibuat dengan <Link href="/">Nauvite</Link>
            </p>
          </footer>
        </main>

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={7600} />
      </div>
    </OpeningProvider>
  );
}

function Person({ person, role, next }: { person: InvitationPerson; role: "Putra" | "Putri"; next: string }) {
  const parents = parentsText(person, role);
  const name = person.name || person.fullname || role;
  return (
    <Reveal className={`${s.station} ${s.reveal}`}>
      <div className={s.sign}>
        <h3>{name}</h3>
        <p className={s.nextStop}>
          {next}
          <svg viewBox="0 0 34 14" aria-hidden="true">
            <path d="M0 7H30M24 1L31 7L24 13" fill="none" stroke="currentColor" strokeWidth="2.4" />
          </svg>
        </p>
      </div>
      <div className={s.stationInfo}>
        <p className={s.fullname}>{person.fullname || person.name}</p>
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
      </div>
    </Reveal>
  );
}

function EventTicket({ event, title }: { event: InvitationEvent; title: string }) {
  const d = toDate(event.date, event.startTime);
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  return (
    <Reveal as="article" className={`${s.event} ${s.reveal}`}>
      <div className={s.eventHead}>
        {d ? (
          <p className={s.eventDate}>
            {part(d, { weekday: "long" })}
            <b>{part(d, { day: "numeric" })}</b>
            {part(d, { month: "long" })}
          </p>
        ) : null}
        <div>
          <h3>{event.title}</h3>
          {time ? <p className={s.eventTime}>{time}</p> : null}
        </div>
        <svg className={s.eventPunch} viewBox="-13 -13 26 24" aria-hidden="true">
          <path d={HEART} />
        </svg>
      </div>
      <div className={s.eventBody}>
        {date ? <p>{date}</p> : null}
        {event.location ? <p className={s.place}>{event.location}</p> : null}
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
        <Barcode text={event.title + (event.location ?? "")} className={s.eventCode} />
      </div>
    </Reveal>
  );
}
