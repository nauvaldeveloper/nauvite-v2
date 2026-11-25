import { Alegreya, Delicious_Handrawn, IM_Fell_English } from "next/font/google";
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
import { Bouquet, speciesList, Twig } from "./art";
import manifest from "./manifest";
import { Cover } from "./parts";
import s from "./template.module.css";

/** Tema Herbarium: undangan tanpa foto berbentuk buku bunga kering. */

const head = IM_Fell_English({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--hb-head" });
const body = Alegreya({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"], variable: "--hb-body" });
const hand = Delicious_Handrawn({ subsets: ["latin"], weight: "400", variable: "--hb-hand" });

const PALETTE: Record<string, string> = { lumut: s.lumut, bata: s.bata, nila: s.nila };

const part = (d: Date, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { ...o, timeZone: "Asia/Jakarta" }).format(d);

/** "aster, melati, dan pakis" */
function joinWords(words: string[]) {
  if (words.length < 2) return words.join("");
  return words.length === 2 ? words.join(" dan ") : `${words.slice(0, -1).join(", ")}, dan ${words[words.length - 1]}`;
}

/** Nama tamu tanpa sapaan, supaya bunganya berasal dari namanya. */
const GREETING_WORDS = /^(bapak|bpk\.?|pak|ibu|bu|sdr\.?|sdri\.?|saudara|saudari|kak|mas|mbak|keluarga besar|keluarga|kel\.?)\s+/i;
function coreName(name: string) {
  let out = name;
  while (GREETING_WORDS.test(out)) out = out.replace(GREETING_WORDS, "");
  return out || name;
}

const GUEST_MAX = 5;

export default function Herbarium({ invitation, guestName }: TemplateProps) {
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
  const guestCore = guestName ? coreName(guestName) : "";
  const guestSpecies = speciesList(guestCore, GUEST_MAX);

  const items = [
    { id: "awal", label: "Awal" },
    { id: "mempelai", label: "Mempelai" },
    ...(content.stories.length ? [{ id: "cerita", label: "Catatan kami" }] : []),
    ...(content.events.length ? [{ id: "acara", label: "Waktu dan tempat" }] : []),
    ...(content.gifts.length ? [{ id: "kado", label: "Tanda kasih" }] : []),
    { id: "ucapan", label: "Tulis catatan" },
  ];

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div className={`${s.root} ${PALETTE[o.palette] ?? s.lumut} ${head.variable} ${body.variable} ${hand.variable}`}>
        <Cover
          plate={
            <>
              <div className={s.emboss}>
                <Bouquet text={pair} max={14} />
              </div>
              <div className={s.plate}>
                <p>Undangan pernikahan</p>
                <h1>
                  {groomName} <i>&amp;</i> {brideName}
                </h1>
                <p className={s.plateTo}>untuk</p>
                <p className={s.plateGuest} data-long={guest.length > 20}>
                  {guest}
                </p>
              </div>
            </>
          }
          page={<Bouquet text={pair} max={14} />}
        />

        <main className={s.main}>
          <section id="awal" className={s.hero}>
            <Reveal className={s.sheet}>
              <span className={s.tape} aria-hidden="true" />
              <Bouquet text={pair} max={14} />
              <p className={s.tag}>
                <b>{title}</b>
                disusun dari huruf nama mereka: {joinWords(speciesList(pair, 14))}
              </p>
            </Reveal>
            <Reveal className={`${s.heroText} ${s.reveal}`}>
              <p>Kami akan menikah</p>
              <h2 className={s.names}>
                {groomName} <i>&amp;</i> {brideName}
              </h2>
              {dateText ? <p className={s.heroDate}>{dateText}</p> : null}
            </Reveal>
          </section>

          <section className={`${s.section} ${s.letter}`}>
            <Reveal className={s.reveal}>
              {o.greeting === "islami" ? <p>Assalamu&rsquo;alaikum warahmatullahi wabarakatuh</p> : null}
              <p className={s.hand}>Untuk {guestName ?? "Bapak/Ibu/Saudara/i"},</p>
              {o.opening.split(/\n\s*\n/).map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </Reveal>
            {o.guestFlower && guestSpecies.length > 0 ? (
              <Reveal className={s.guestCard}>
                <span className={s.tape} aria-hidden="true" />
                <Bouquet text={guestCore} max={GUEST_MAX} />
                <div>
                  <p className={s.hand}>{guestName}</p>
                  <p>Rangkaian ini dari huruf nama Anda: {joinWords(guestSpecies)}. Simpan untuk kami, ya.</p>
                </div>
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
            <Person person={groom} role="Putra" />
            <Person person={bride} role="Putri" />
          </section>

          {content.stories.length > 0 ? (
            <section id="cerita" className={`${s.section} ${s.ruled}`}>
              <h2 className={s.heading}>Catatan kami</h2>
              <ol className={s.notes}>
                {content.stories.map((story, i) => (
                  <Reveal as="li" key={i} className={`${s.note} ${s.reveal}`}>
                    <Twig text={story.title + i} />
                    <div>
                      {story.date ? <p className={s.hand}>{story.date}</p> : null}
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
              <h2 className={s.heading}>Mekar dalam</h2>
              <Reveal className={s.reveal}>
                <Countdown
                  target={main.toISOString()}
                  className={s.countdown}
                  itemClassName={s.countItem}
                  doneText="Harinya sudah mekar. Terima kasih atas doanya."
                />
              </Reveal>
            </section>
          ) : null}

          {content.events.length > 0 ? (
            <section id="acara" className={s.section}>
              <h2 className={s.heading}>Waktu dan tempat</h2>
              <div className={s.list}>
                {content.events.map((event, i) => (
                  <EventSheet key={i} event={event} title={title} />
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
              <p className={s.lead}>Doa Anda sudah lebih dari cukup. Bagi yang ingin menitipkan benih untuk rumah kami:</p>
              <div className={s.packets}>
                {content.gifts.map((gift, i) => {
                  const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                  return (
                    <Reveal key={i} className={`${s.packet} ${s.reveal}`}>
                      <Twig text={gift.bank + gift.accountName} />
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

          <section id="ucapan" className={`${s.section} ${s.ruled}`}>
            <h2 className={s.heading}>Tulis catatan</h2>
            <p className={s.lead}>Kabari kami apakah Anda bisa datang, dan tuliskan doa untuk disimpan di buku ini.</p>
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
              cls={{ list: s.wishes, item: s.wish, name: s.hand, message: s.wishMessage, date: s.wishDate, empty: s.lead }}
            />
          </section>

          <footer className={s.footer}>
            <Reveal className={s.footerArt}>
              <Bouquet text={brideName + groomName} max={14} />
            </Reveal>
            <p>Terima kasih sudah menjadi bagian dari halaman ini.</p>
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

        <GuideDock items={items} autoStart={o.autoScroll} startDelay={6200} />
      </div>
    </OpeningProvider>
  );
}

function Person({ person, role }: { person: InvitationPerson; role: "Putra" | "Putri" }) {
  const parents = parentsText(person, role);
  const name = person.name || person.fullname || role;
  return (
    <Reveal className={`${s.specimen} ${s.reveal}`}>
      <span className={s.tape} aria-hidden="true" />
      <Bouquet text={name} max={8} />
      <div className={s.card}>
        <h3>{person.fullname || person.name}</h3>
        {parents ? (
          <p>
            {parents.prefix} {parents.names}
          </p>
        ) : null}
        <p className={s.small}>{joinWords(speciesList(name, 8))}</p>
        {person.social ? (
          <a href={person.social.url} target="_blank" rel="noreferrer">
            <SocialIcon kind={person.social.kind} /> @{person.social.handle}
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}

function EventSheet({ event, title }: { event: InvitationEvent; title: string }) {
  const d = toDate(event.date, event.startTime);
  const date = eventDateText(event);
  const time = formatTimeRange(event);
  const cal = googleCalendarUrl(event, title);
  return (
    <Reveal as="article" className={`${s.event} ${s.reveal}`}>
      <span className={s.tape} aria-hidden="true" />
      <div className={s.eventArt}>
        <Bouquet text={event.title + (event.location ?? "")} max={9} />
        {d ? (
          <p className={s.eventDate}>
            <b>{part(d, { day: "numeric" })}</b>
            {part(d, { month: "long" })}
          </p>
        ) : null}
      </div>
      <div className={s.card}>
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
