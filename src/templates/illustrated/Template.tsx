import { Amiri, Cormorant_Garamond, Mulish, Pinyon_Script } from "next/font/google";
import Link from "next/link";
import type { CSSProperties } from "react";
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
  bankLogo,
  eventDateText,
  formatLongDate,
  formatTimeRange,
  googleCalendarUrl,
  mainEventDate,
  mediaUrl,
  parentsText,
  youtubeId,
} from "@/lib/invitation/format";
import { resolveOptions } from "../options";
import type { TemplateManifest } from "../manifest";
import type { TemplateProps } from "../types";
import { Cover, MusicButton, PagePetals, type Assets } from "./parts";
import { ASSET_FILES, DEFAULT_LABELS, assetUrl, type AssetKey, type IllustratedFields, type IllustratedTheme } from "./theme";
import s from "./template.module.css";

/**
 * Kerangka tema ilustrasi (Premium). Satu tampilan untuk banyak tema: aset,
 * palet, dan label datang dari `theme` (lihat theme.ts dan src/templates/sage-garden).
 */

const script = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--il-script" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--il-serif",
});
const sans = Mulish({ subsets: ["latin"], variable: "--il-sans" });
const arabic = Amiri({ subsets: ["arabic"], weight: "400", variable: "--il-arabic" });

/** Penundaan animasi untuk efek muncul bergiliran. */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

type IllustratedManifest = TemplateManifest & { fields: IllustratedFields };

export default function Illustrated({
  invitation,
  guestName,
  theme,
  manifest,
}: TemplateProps & { theme: IllustratedTheme; manifest: IllustratedManifest }) {
  const { content, slug } = invitation;
  const opt = resolveOptions(manifest, invitation.templateOptions, invitation.id);
  const L = { ...DEFAULT_LABELS, ...theme.labels };
  const a = Object.fromEntries(
    (Object.keys(ASSET_FILES) as AssetKey[]).map((k) => [k, assetUrl(theme, k)]),
  ) as Assets;
  const p = theme.palette;
  const rootStyle = {
    "--dark": opt.darkColor,
    "--paper": p.paper,
    "--ink": p.ink,
    "--muted": p.muted,
    "--accent": p.accent,
    "--gold": p.gold,
    "--cream": p.cream,
    "--photo-bg": p.photoBg,
    "--a-paper": `url("${a.paper}")`,
    "--a-left": `url("${a.left}")`,
    "--a-right": `url("${a.right}")`,
    ...theme.vars,
  } as CSSProperties;
  const { groom, bride } = content.couple;
  const main = mainEventDate(content);
  const photo = mediaUrl(content.coverImage ?? content.gallery[0]);
  const firstEvent = content.events[0];
  const calendar = firstEvent ? googleCalendarUrl(firstEvent, `${groom.name} & ${bride.name}`) : null;
  const video = youtubeId(content.youtubeUrl);
  const islami = opt.greeting === "islami";

  const names = (
    <h1 className={s.names}>
      <span>{groom.name || "Mempelai Pria"}</span>
      <span className={s.namesAmp}>&amp;</span>
      <span>{bride.name || "Mempelai Wanita"}</span>
    </h1>
  );

  return (
    <OpeningProvider music={mediaUrl(content.music)}>
      <div
        className={`${s.root} ${script.variable} ${serif.variable} ${sans.variable} ${arabic.variable}`}
        style={rootStyle}
      >
        <Cover
          a={a}
          labels={L}
          photo={opt.coverStyle === "foto" ? photo : undefined}
          names={names}
          guestName={guestName}
          petals={opt.petals}
        />
        {opt.petals ? <PagePetals a={a} /> : null}

        {/* Layar lebar: panel kiri berisi foto dan nama, tetap di tempat */}
        <aside className={s.side} aria-hidden="true">
          <div className={s.paper} />
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={s.sidePhoto} src={photo} alt="" />
          ) : null}
          <div className={s.sideShade} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`${s.cornerLeft} ${s.sway}`} src={a.left} alt="" />
          <div className={s.sideContent}>
            <p className={s.kicker}>{L.coverKicker}</p>
            <p className={s.names}>
              <span>{groom.name}</span>
              <span className={s.namesAmp}>&amp;</span>
              <span>{bride.name}</span>
            </p>
            {main ? <p className={s.dateLine}>{formatLongDate(main)}</p> : null}
          </div>
        </aside>

        <main className={s.main}>
          {/* ---------- Pembuka: foto berbingkai, nama, hitung mundur ---------- */}
          <section className={`${s.section} ${s.hero}`}>
            <div className={s.paper} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={`${s.cornerLeft} ${s.sway} ${s.cornerSmall}`} src={a.left} alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={`${s.cornerRight} ${s.swayAlt} ${s.cornerSmall}`} src={a.right} alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={`${s.stain} ${s.drift}`} src={a.stain} alt="" />

            <div className={s.inner}>
              <Reveal className={s.rv}>
                <p className={s.kicker}>{L.heroKicker}</p>
              </Reveal>
              <Reveal className={`${s.frameWrap} ${s.rvZoom}`} style={d(150)}>
                <OvalPhoto a={a} src={photo} />
              </Reveal>
              <Reveal className={s.rv} style={d(250)}>
                <p className={s.names}>
                  <span>{groom.name}</span>
                  <span className={s.namesAmp}>&amp;</span>
                  <span>{bride.name}</span>
                </p>
              </Reveal>
              <Reveal className={s.rv} style={d(350)}>
                <p className={s.lead}>{L.heroLead}</p>
              </Reveal>
              {main ? (
                <>
                  <Reveal className={s.rv} style={d(450)}>
                    <Countdown target={main.toISOString()} className={s.countdown} itemClassName={s.countdownItem} />
                  </Reveal>
                  <Reveal className={s.rv} style={d(550)}>
                    <p className={s.dateLine}>{formatLongDate(main)}</p>
                  </Reveal>
                </>
              ) : null}
              {calendar ? (
                <Reveal className={s.rv} style={d(650)}>
                  <a className={s.button} href={calendar} target="_blank" rel="noreferrer">
                    <IconCalendar /> {L.saveDate}
                  </a>
                </Reveal>
              ) : null}
            </div>
          </section>

          {/* ---------- Salam dan kutipan ---------- */}
          <section className={s.section}>
            <div className={s.paper} />
            <div className={s.inner}>
              {islami ? (
                <>
                  <Reveal className={s.rv}>
                    <p className={s.bismillah} lang="ar" dir="rtl">
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                    </p>
                  </Reveal>
                  <Reveal className={s.rv} style={d(150)}>
                    <p className={s.salam}>Assalamu&apos;alaikum Wr. Wb.</p>
                  </Reveal>
                  <Reveal className={s.rv} style={d(250)}>
                    <p className={s.body}>
                      Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri
                      kami.
                    </p>
                  </Reveal>
                </>
              ) : (
                <Reveal className={s.rv}>
                  <p className={s.lead}>
                    Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu di hari
                    pernikahan kami.
                  </p>
                </Reveal>
              )}
              <Garland a={a} />
              {content.quotes ? (
                <Reveal className={s.rv} style={d(150)}>
                  <figure className={s.quote}>
                    <blockquote>{content.quotes}</blockquote>
                    {content.quotesSource ? <figcaption>{content.quotesSource}</figcaption> : null}
                  </figure>
                </Reveal>
              ) : null}
            </div>
          </section>

          {/* ---------- Mempelai ---------- */}
          <section className={s.section}>
            <div className={s.paper} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={`${s.stain} ${s.stainRight} ${s.drift}`} src={a.stain} alt="" />
            <div className={s.inner}>
              <Reveal className={s.rv}>
                <h2 className={s.heading}>{L.couple}</h2>
              </Reveal>
              <Person a={a} person={groom} role="Putra" from="left" />
              <Reveal className={`${s.ampersand} ${s.rvBloom}`}>&amp;</Reveal>
              <Person a={a} person={bride} role="Putri" from="right" />
            </div>
          </section>

          {/* ---------- Acara (bagian gelap) ---------- */}
          {content.events.length > 0 ? (
            <section className={`${s.section} ${s.dark}`}>
              <Wave />
              <div className={s.leafTexture} />
              <div className={s.inner}>
                <Reveal className={s.rv}>
                  <h2 className={s.heading}>{L.events}</h2>
                </Reveal>
                <div className={s.events}>
                  {content.events.map((event, i) => {
                    const date = eventDateText(event);
                    const time = formatTimeRange(event);
                    return (
                      <Reveal key={i} className={`${s.card} ${s.eventCard} ${i % 2 ? s.rvRight : s.rvLeft}`} style={d(i * 120)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className={s.cardCluster} src={a.clusterA} alt="" />
                        <h3 className={s.eventTitle}>{event.title}</h3>
                        <div className={s.eventRule} />
                        {date ? <p className={s.eventDate}>{date}</p> : null}
                        {time ? <p>{time}</p> : null}
                        {event.location ? <p className={s.eventPlace}>{event.location}</p> : null}
                        {event.address ? <p className={s.muted}>{event.address}</p> : null}
                        {event.entertainment ? <p className={s.muted}>Hiburan: {event.entertainment}</p> : null}
                        {event.mapsUrl ? (
                          <a className={s.button} href={event.mapsUrl} target="_blank" rel="noreferrer">
                            <IconPin /> {L.map}
                          </a>
                        ) : null}
                      </Reveal>
                    );
                  })}
                </div>
              </div>
              <Wave flip />
            </section>
          ) : null}

          {/* ---------- Cerita ---------- */}
          {content.stories.length > 0 ? (
            <section className={s.section}>
              <div className={s.paper} />
              <div className={s.inner}>
                <Reveal className={s.rv}>
                  <h2 className={s.heading}>{L.story}</h2>
                </Reveal>
                <Garland a={a} />
                <ol className={s.timeline}>
                  {content.stories.map((story, i) => (
                    <Reveal as="li" key={i} className={`${s.story} ${s.rv}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className={s.storyLeaf} src={a.petal2} alt="" />
                      {story.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={s.storyImage} src={mediaUrl(story.image)} alt="" loading="lazy" />
                      ) : null}
                      {story.date ? <p className={s.storyDate}>{story.date}</p> : null}
                      <h3 className={s.storyTitle}>{story.title}</h3>
                      {story.description ? <p className={s.body}>{story.description}</p> : null}
                    </Reveal>
                  ))}
                </ol>
              </div>
            </section>
          ) : null}

          {/* ---------- Galeri ---------- */}
          {content.gallery.length > 0 ? (
            <section className={s.section}>
              <div className={s.paper} />
              <div className={s.inner}>
                <Reveal className={s.rv}>
                  <h2 className={s.heading}>{L.gallery}</h2>
                </Reveal>
                <div className={s.gallery}>
                  {content.gallery.map((src, i) => (
                    <Reveal key={i} className={`${s.galleryItem} ${s.rvZoom}`} style={d((i % 3) * 100)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mediaUrl(src)} alt={`Foto ${i + 1}`} loading="lazy" />
                    </Reveal>
                  ))}
                </div>
                {video ? (
                  <Reveal className={`${s.video} ${s.rvZoom}`}>
                    <YoutubeVideo id={video} title="Video" />
                  </Reveal>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* ---------- Tanda kasih + ucapan (bagian gelap) ---------- */}
          <section className={`${s.section} ${s.dark}`}>
            <Wave />
            <div className={s.leafTexture} />
            <div className={s.inner}>
              {content.gifts.length > 0 ? (
                <>
                  <Reveal className={s.rv}>
                    <h2 className={s.heading}>{L.gifts}</h2>
                  </Reveal>
                  <Reveal className={s.rv} style={d(100)}>
                    <p className={s.lead}>{L.giftsLead}</p>
                  </Reveal>
                  <div className={s.gifts}>
                    {content.gifts.map((gift, i) => {
                      const logo = gift.logo ? mediaUrl(gift.logo) : bankLogo(gift.bank);
                      return (
                        <Reveal key={i} className={`${s.card} ${s.giftCard} ${s.rvZoom}`} style={d(i * 120)}>
                          {logo ? (
                            <span className={s.bankChip}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={logo} alt={gift.bank} />
                            </span>
                          ) : (
                            <p className={s.bankName}>{gift.bank}</p>
                          )}
                          <p className={s.accountNumber}>{gift.accountNumber}</p>
                          <p className={s.muted}>a.n. {gift.accountName}</p>
                          <CopyButton value={gift.accountNumber} className={s.buttonGhost} label="Salin Nomor" />
                        </Reveal>
                      );
                    })}
                  </div>
                </>
              ) : null}

              <Reveal className={s.rv}>
                <h2 className={`${s.heading} ${content.gifts.length ? s.headingGap : ""}`}>{L.wishes}</h2>
              </Reveal>
              <Reveal className={`${s.card} ${s.formCard} ${s.rv}`} style={d(100)}>
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
              </Reveal>
              <WishList
                slug={slug}
                cls={{
                  list: s.wishes,
                  item: s.wish,
                  name: s.wishName,
                  message: s.wishMessage,
                  date: s.wishDate,
                  empty: s.wishEmpty,
                }}
              />
            </div>
            <Wave flip />
          </section>

          {/* ---------- Penutup ---------- */}
          <section className={`${s.section} ${s.closing}`}>
            <div className={s.paper} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={`${s.stain} ${s.drift}`} src={a.stain} alt="" />
            <div className={s.inner}>
              <Reveal className={s.rvBloom}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={`${s.closingCluster} ${s.breathe}`} src={a.clusterB} alt="" />
              </Reveal>
              <Reveal className={s.rv} style={d(150)}>
                <p className={s.body}>

                  {islami ? " Wassalamu'alaikum Wr. Wb." : ""}
                </p>
              </Reveal>
              <Reveal className={s.rv} style={d(250)}>
                <p className={s.kicker}>{L.closingKicker}</p>
              </Reveal>
              <Reveal className={s.rv} style={d(350)}>
                <p className={s.names}>
                  <span>{groom.name}</span>
                  <span className={s.namesAmp}>&amp;</span>
                  <span>{bride.name}</span>
                </p>
              </Reveal>
            </div>
          </section>

          <footer className={s.footer}>
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

        <MusicButton />
      </div>
    </OpeningProvider>
  );
}

/** Foto dalam bingkai lonjong dengan buket kecil yang "keluar" dari bingkainya. */
function OvalPhoto({ a, src, small }: { a: Assets; src?: string; small?: boolean }) {
  return (
    <div className={`${s.frame} ${small ? s.frameSmall : ""}`}>
      <div className={s.frameOval}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" />
        ) : (
          <div className={s.frameEmpty} />
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${s.frameClusterTop} ${s.breathe}`} src={a.clusterA} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${s.frameClusterBottom} ${s.breatheAlt}`} src={a.clusterB} alt="" />
    </div>
  );
}

function Person({
  a,
  person,
  role,
  from,
}: {
  a: Assets;
  person: InvitationPerson; role: "Putra" | "Putri"; from: "left" | "right" }) {
  const parents = parentsText(person, role);
  return (
    <Reveal className={`${s.person} ${from === "left" ? s.rvLeft : s.rvRight}`}>
      <OvalPhoto a={a} src={mediaUrl(person.image)} small />
      <p className={s.personNick}>{person.name}</p>
      <h3 className={s.personName}>{person.fullname || person.name}</h3>
      {parents ? (
        <p className={s.body}>
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

/** Rangkaian daun sebagai pembatas, muncul melebar dari tengah. */
function Garland({ a }: { a: Assets }) {
  return (
    <Reveal className={`${s.garland} ${s.rvWide}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.divider} alt="" />
    </Reveal>
  );
}

/** Bentuk gelombang yang berulang tiap `period`, supaya bisa digeser terus tanpa sambungan terlihat. */
function wavePath(period: number, amp: number, base: number, width = 2880) {
  let d = `M0 ${base}`;
  for (let x = 0; x < width; x += period) {
    const h = period / 2;
    d += ` Q${x + h / 2} ${base - amp} ${x + h} ${base} T${x + period} ${base}`;
  }
  return `${d} V120 H0 Z`;
}

const WAVE_BACK = wavePath(720, 26, 58);
const WAVE_FRONT = wavePath(480, 18, 78);

/** Gelombang pemisah bagian terang dan gelap, dua lapis yang bergerak dengan kecepatan berbeda. */
function Wave({ flip }: { flip?: boolean }) {
  return (
    <div className={`${s.wave} ${flip ? s.waveBottom : s.waveTop}`} aria-hidden="true">
      <svg className={s.waveBack} viewBox="0 0 2880 120" preserveAspectRatio="none">
        <path d={WAVE_BACK} />
      </svg>
      <svg className={s.waveFront} viewBox="0 0 2880 120" preserveAspectRatio="none">
        <path d={WAVE_FRONT} />
      </svg>
    </div>
  );
}
