import { EB_Garamond, La_Belle_Aurore, Petit_Formal_Script } from "next/font/google";
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
import { Crest, EventScene, Foliage, Postmark, Seal, StampFlower } from "./art";
import manifest from "./manifest";
import { Cover } from "./parts";
import s from "./template.module.css";

/**
 * Tema Surat Cinta: undangan tanpa foto berbentuk surat pos.
 * Foto yang mungkin sudah diunggah klien sengaja tidak ditampilkan di tema ini.
 */

const script = Petit_Formal_Script({ subsets: ["latin"], weight: "400", variable: "--sc-script" });
const body = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--sc-body",
});
const hand = La_Belle_Aurore({ subsets: ["latin"], weight: "400", variable: "--sc-hand" });

const PALETTE: Record<string, string> = { anggur: s.anggur, laut: s.laut, zaitun: s.zaitun };

/** "2027-02-14" di zona WIB. */
const isoDate = (date: Date) => date.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

/** Bagian tanggal di zona WIB. */
function dateParts(date: Date) {
  const get = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(date);
  return {
    day: get({ day: "numeric" }),
    month: get({ month: "short" }),
    monthLong: get({ month: "long" }),
    year: get({ year: "numeric" }),
  };
}

const initial = (name: string, fallback: string) => (name.trim()[0] ?? fallback).toUpperCase();

export default function SuratCinta({ invitation, guestName }: TemplateProps) {
  const { content, slug } = invitation;
  const { groom, bride } = content.couple;
  const o = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const title = coupleTitle(content);
  const main = mainEventDate(content);
  const dateText = main ? formatLongDate(main) : content.weddingDate;
  const p = main ? dateParts(main) : null;
  const video = youtubeId(content.youtubeUrl);
  const groomName = groom.name || "Mempelai Pria";
  const brideName = bride.name || "Mempelai Wanita";
  const gi = initial(groom.name, "P");
  const bi = initial(bride.name, "W");
  const guest = guestName ?? "Tamu Undangan";
  const ring = title.length <= 16 ? title.toUpperCase() : `${gi} & ${bi}`;
  const mark = (id: string) => (p ? <Postmark id={id} ring={ring} day={p.day} month={p.month} year={p.year} /> : null);

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div
        className={`${s.root} ${PALETTE[o.palette] ?? s.anggur} ${script.variable} ${body.variable} ${hand.variable}`}
      >
        <Cover
          heading={
            <>
              <p>Undangan pernikahan</p>
              <h1 className={s.names}>
                <span>{groomName}</span>
                <i>&amp;</i>
                <span>{brideName}</span>
              </h1>
            </>
          }
          foliage={
            <>
              <Foliage className={`${s.foliage} ${s.foliageLeft}`} />
              <Foliage className={`${s.foliage} ${s.foliageRight}`} />
              <Foliage className={`${s.foliage} ${s.foliageTop}`} />
            </>
          }
          front={
            <div className={s.frontPaper}>
              <p className={s.sender}>
                Pengirim
                <span>{title}</span>
              </p>
              <div className={s.frontStamp}>
                <div className={`${s.stamp} ${s.stampSmall}`}>
                  <StampFlower kind="kamboja" />
                </div>
              </div>
              <div className={s.frontMark}>{mark("cap-sampul")}</div>
              <div className={s.address}>
                <p>Kepada Yth.</p>
                <p className={s.addressName} data-long={guest.length > 20}>
                  {guest}
                </p>
                <p className={s.addressLine}>di tempat</p>
              </div>
            </div>
          }
          seal={<Seal text={`${gi}${bi}`} />}
          letter={
            <>
              <p className={s.letterCardNames}>{title}</p>
              {dateText ? <p>{dateText}</p> : null}
            </>
          }
        />

        <Foliage className={`${s.foliage} ${s.side} ${s.sideLeft}`} />
        <Foliage className={`${s.foliage} ${s.side} ${s.sideRight}`} />

        <main className={s.main}>
          <section id="awal" className={s.hero}>
            <div className={s.heroMark}>{mark("cap-surat")}</div>
            <Reveal className={s.heroInner}>
              <Crest left={gi} right={bi} />
              <p className={s.lead}>Kami akan menikah</p>
              <h2 className={s.names}>
                <span>{groomName}</span>
                <i>&amp;</i>
                <span>{brideName}</span>
              </h2>
              {dateText ? <p className={s.heroDate}>{dateText}</p> : null}
            </Reveal>
          </section>

          <section className={s.letter}>
            <Reveal className={s.reveal}>
              {o.greeting === "islami" ? (
                <p className={s.salam}>Assalamu&rsquo;alaikum warahmatullahi wabarakatuh</p>
              ) : null}
              <p className={s.dear}>
                Untuk <span>{guestName ?? "Bapak/Ibu/Saudara/i"}</span>,
              </p>
              {o.letter.split(/\n\s*\n/).map((t, i) => (
                <p key={i} className={s.letterText}>
                  {t}
                </p>
              ))}
              <p className={s.signOff}>Salam hangat,</p>
              <p className={s.signature}>{title}</p>
            </Reveal>
          </section>

          {content.quotes ? (
            <section className={s.quote}>
              <Reveal className={s.reveal}>
                <blockquote>{content.quotes}</blockquote>
                {content.quotesSource ? <p>{content.quotesSource}</p> : null}
              </Reveal>
            </section>
          ) : null}

          <section id="mempelai" className={s.section}>
            <h2 className={s.heading}>Mempelai</h2>
            <Person person={groom} role="Putra" kind="kamboja" letter={gi} year={p?.year} />
            <Person person={bride} role="Putri" kind="melati" letter={bi} year={p?.year} flip />
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={`${s.section} ${s.tint}`}>
              <h2 className={s.heading}>Cerita kami</h2>
              <ol className={s.stories}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.story} ${s.reveal}`}>
                    {story.date ? <p className={s.storyDate}>{story.date}</p> : null}
                    <h3>{story.title}</h3>
                    {story.description ? <p>{story.description}</p> : null}
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {main ? (
            <>
              <section className={s.section}>
                <h2 className={s.heading}>Simpan tanggalnya</h2>
                <Reveal className={s.reveal}>
                  <MonthCalendar date={main} />
                </Reveal>
              </section>
              <section className={s.countSection}>
                <Foliage className={`${s.foliage} ${s.countFoliage}`} />
                <Reveal className={s.reveal}>
                  <p className={s.countLead}>Sampai bertemu dalam</p>
                  <Countdown target={main.toISOString()} className={s.countdown} itemClassName={`${s.stamp} ${s.countdownItem}`} />
                </Reveal>
              </section>
            </>
          ) : null}

          {content.events.length > 0 ? (
            <section id="acara" className={`${s.section} ${s.tint}`}>
              <h2 className={s.heading}>Waktu dan tempat</h2>
              <div className={s.postcards}>
                {content.events.map((event, i) => (
                  <Postcard key={i} event={event} index={i} title={title} />
                ))}
              </div>
            </section>
          ) : null}

          {video ? (
            <section className={s.section}>
              <h2 className={s.heading}>Video</h2>
              <YoutubeVideo id={video} title={`Video ${title}`} className={s.video} />
            </section>
          ) : null}

          {content.gifts.length > 0 ? (
            <section id="kado" className={s.section}>
              <h2 className={s.heading}>Tanda kasih</h2>
              <p className={s.sectionLead}>
                Doa Anda sudah lebih dari cukup. Bagi yang ingin mengirim tanda kasih, bisa lewat rekening berikut.
              </p>
              <div className={s.gifts}>
                {content.gifts.map((gift, i) => {
                  const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                  return (
                    <Reveal key={i} className={`${s.gift} ${s.reveal}`}>
                      <div className={s.giftInner}>
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt={gift.bank} />
                        ) : (
                          <p className={s.bankName}>{gift.bank}</p>
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

          <section id="ucapan" className={`${s.section} ${s.tint}`}>
            <h2 className={s.heading}>Balas surat ini</h2>
            <p className={s.sectionLead}>Kabari kami apakah Anda bisa datang, dan titipkan doa di sini.</p>
            <div className={s.reply}>
              <WishForm
                slug={slug}
                defaultName={guestName ?? undefined}
                cls={{
                  form: s.form,
                  field: s.field,
                  label: s.label,
                  input: s.input,
                  textarea: `${s.input} ${s.lined}`,
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
            <div className={s.footerSeal}>
              <Seal text={`${gi}${bi}`} />
            </div>
            <p>Sampai bertemu di hari bahagia kami.</p>
            {o.greeting === "islami" ? <p>Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
            <p className={s.footerNames}>{title}</p>
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

        <GuideDock
          items={[
            { id: "awal", label: "Awal" },
            { id: "mempelai", label: "Mempelai" },
            ...(content.stories.length ? [{ id: "cerita", label: "Cerita kami" }] : []),
            ...(content.events.length ? [{ id: "acara", label: "Waktu dan tempat" }] : []),
            ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
            { id: "ucapan", label: "Balas surat ini" },
          ]}
          autoStart={o.autoScroll}
          startDelay={6800}
        />
      </div>
    </OpeningProvider>
  );
}

function Person({
  person,
  role,
  kind,
  letter,
  year,
  flip = false,
}: {
  person: InvitationPerson;
  role: "Putra" | "Putri";
  kind: "melati" | "kamboja";
  letter: string;
  year?: string;
  flip?: boolean;
}) {
  const parents = parentsText(person, role);
  return (
    <Reveal className={`${s.person} ${s.reveal}`} data-flip={flip}>
      <div className={s.personStamp}>
        <div className={`${s.stamp} ${s.stampBig}`}>
          <StampFlower kind={kind} />
          <p className={s.stampCaption} aria-hidden="true">
            <b>{letter}</b>
            <span>{year}</span>
          </p>
        </div>
      </div>
      <div className={s.personText}>
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
      </div>
    </Reveal>
  );
}

/** Satu acara sebagai kartu pos bergambar. */
function Postcard({ event, index, title }: { event: InvitationEvent; index: number; title: string }) {
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  const d = toDate(event.date, event.startTime);
  const p = d ? dateParts(d) : null;
  return (
    <Reveal as="article" className={`${s.postcard} ${s.reveal}`}>
      <EventScene index={index} />
      {p ? (
        <div className={s.dateStampWrap} aria-hidden="true">
          <p className={`${s.stamp} ${s.dateStamp}`}>
            <b>{p.day}</b>
            {p.month}
          </p>
        </div>
      ) : null}
      <div className={s.postcardBody}>
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

/** Kalender sebulan, tanggal acara dilingkari dengan garis tangan. */
function MonthCalendar({ date }: { date: Date }) {
  const [y, m, d] = isoDate(date).split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return (
    <div className={s.calendar} role="img" aria-label={formatLongDate(date)}>
      <p className={s.calendarTitle}>
        {dateParts(date).monthLong} {y}
      </p>
      <div className={s.calendarGrid} aria-hidden="true">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((w) => (
          <small key={w}>{w}</small>
        ))}
        {Array.from({ length: days }, (_, i) => (
          <span key={i} data-day={i + 1 === d} style={i === 0 ? { gridColumnStart: first + 1 } : undefined}>
            {i + 1}
            {i + 1 === d ? (
              <svg viewBox="0 0 60 60">
                <path pathLength={1} d="M42 9C24 1 5 14 6 32C8 52 33 59 47 46C60 32 52 8 31 6C22 5 14 9 9 15" />
              </svg>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
