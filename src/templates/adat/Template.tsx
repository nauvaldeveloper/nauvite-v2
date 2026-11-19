import { Amiri, Cormorant_Garamond, Mulish, Noto_Sans_Sundanese, Pinyon_Script } from "next/font/google";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
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
import { MusicButton, PagePetals, type Assets } from "../illustrated/parts";
import { ASSET_FILES, DEFAULT_LABELS, assetUrl, type AssetKey } from "../illustrated/theme";
import { DoorCover, SceneHero, type OrnamentAssets, type SceneAssets } from "./scene";
import {
  ORNAMENT_FILES,
  SCENE_FILES,
  ornamentUrl,
  sceneUrl,
  type AdatFields,
  type AdatTheme,
  type HeadingKey,
  type OrnamentKey,
  type SceneKey,
} from "./theme";
import s from "./adat.module.css";

/**
 * Kerangka tema adat (Premium). Data dan fitur sama dengan tema ilustrasi, tetapi
 * berbaju adat: pintu kayu dan pemandangan berlapis, foto berbingkai rumah adat,
 * judul beraksara daerah dengan pembatas, bagian gelap bertekstur anyaman.
 * Aset, palet, label, dan aksara datang dari `theme` (lihat theme.ts dan src/templates/sundanese-elegance).
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
// Aksara daerah; dimuat hanya saat glyph-nya dipakai.
const aksara = Noto_Sans_Sundanese({ subsets: ["sundanese"], weight: "400", variable: "--il-aksara", preload: false });

/** Penundaan animasi untuk efek muncul bergiliran. */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

type AdatManifest = TemplateManifest & { fields: AdatFields };

export default function Adat({
  invitation,
  guestName,
  theme,
  manifest,
}: TemplateProps & { theme: AdatTheme; manifest: AdatManifest }) {
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
    "--o-weave": `url("${ornamentUrl(theme, "weave")}")`,
    "--o-corner": `url("${ornamentUrl(theme, "corner")}")`,
    ...theme.vars,
  } as CSSProperties;
  const { groom, bride } = content.couple;
  const main = mainEventDate(content);
  const photo = mediaUrl(content.coverImage ?? content.gallery[0]);
  const firstEvent = content.events[0];
  const calendar = firstEvent ? googleCalendarUrl(firstEvent, `${groom.name} & ${bride.name}`) : null;
  const video = youtubeId(content.youtubeUrl);
  const islami = opt.greeting === "islami";
  const sa = Object.fromEntries((Object.keys(SCENE_FILES) as SceneKey[]).map((k) => [k, sceneUrl(theme, k)])) as SceneAssets;
  const orn = Object.fromEntries(
    (Object.keys(ORNAMENT_FILES) as OrnamentKey[]).map((k) => [k, ornamentUrl(theme, k)]),
  ) as OrnamentAssets;
  const aks = (key: HeadingKey) => theme.aksara?.[key];
  const framePhoto = opt.coverStyle === "foto" ? photo : undefined;

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
        className={`${s.root} ${script.variable} ${serif.variable} ${sans.variable} ${arabic.variable} ${aksara.variable}`}
        style={rootStyle}
      >
        <DoorCover
          sa={sa}
          orn={orn}
          scene={theme.scene}
          script={aks("greeting")}
          labels={L}
          names={names}
          guestName={guestName}
          animate={opt.openingAnimation}
        />
        {opt.petals ? <PagePetals a={a} /> : null}

        {/* Layar lebar: panel kiri berisi foto dan nama, tetap di tempat */}
        {/* Layar lebar: pemandangan tetap di panel kiri, isi undangan di kolom kanan */}
        <aside className={s.side} aria-hidden="true">
          <SceneHero
            sa={sa}
            orn={orn}
            scene={theme.scene}
            names={names}
            date={main ? formatLongDate(main) : null}
            photo={framePhoto}
            className={s.sideScene}
          />
        </aside>

        <main className={s.main}>
          <div className={s.mainScene}>
            <SceneHero sa={sa} orn={orn} scene={theme.scene} names={names} date={main ? formatLongDate(main) : null} photo={framePhoto} />
          </div>

          {/* ---------- Pembuka: foto berbingkai, nama, hitung mundur ---------- */}
          <section className={`${s.section} ${s.hero}`}>
            <div className={s.paper} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={`${s.stain} ${s.drift}`} src={a.stain} alt="" />

            <div className={s.inner}>
              <Reveal className={s.rv}>
                <Kicker script={aks("hero")}>{L.heroKicker}</Kicker>
              </Reveal>
              <Reveal className={`${s.frameWrap} ${s.rvZoom}`} style={d(150)}>
                <HouseFrame orn={orn} a={a} src={framePhoto} />
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
                <Heading orn={orn} script={aks("couple")}>{L.couple}</Heading>
              </Reveal>
              <Person a={a} orn={orn} person={groom} role="Putra" from="left" />
              <Reveal className={`${s.ampersand} ${s.rvBloom}`}>&amp;</Reveal>
              <Person a={a} orn={orn} person={bride} role="Putri" from="right" />
            </div>
          </section>

          {/* ---------- Acara (bagian gelap) ---------- */}
          {content.events.length > 0 ? (
            <section className={`${s.section} ${s.dark}`}>
              <Wave />
              <div className={s.leafTexture} />
              <div className={s.inner}>
                <Reveal className={s.rv}>
                  <Heading orn={orn} script={aks("events")}>{L.events}</Heading>
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
                  <Heading orn={orn} script={aks("story")}>{L.story}</Heading>
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
                  <Heading orn={orn} script={aks("gallery")}>{L.gallery}</Heading>
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
                    <Heading orn={orn} script={aks("gifts")}>{L.gifts}</Heading>
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
                <Heading orn={orn} script={aks("wishes")} gap={content.gifts.length > 0}>{L.wishes}</Heading>
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
            <Reveal className={`${s.closingFigure} ${s.closingFigureLeft} ${s.rvLeft}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sa.figureLeft} alt="" />
            </Reveal>
            <Reveal className={`${s.closingFigure} ${s.closingFigureRight} ${s.rvRight}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sa.figureRight} alt="" />
            </Reveal>
            <div className={s.inner}>
              <Reveal className={s.rvBloom}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={s.closingCrown} src={orn.crown} alt="" />
              </Reveal>
              <Reveal className={s.rv} style={d(150)}>
                <p className={s.body}>
                  {L.closing}
                  {islami ? " Wassalamu'alaikum Wr. Wb." : ""}
                </p>
              </Reveal>
              <Reveal className={s.rv} style={d(250)}>
                <Kicker script={aks("closing")}>{L.closingKicker}</Kicker>
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

function Person({
  a,
  orn,
  person,
  role,
  from,
}: {
  a: Assets;
  orn: OrnamentAssets;
  person: InvitationPerson;
  role: "Putra" | "Putri";
  from: "left" | "right";
}) {
  const parents = parentsText(person, role);
  return (
    <Reveal className={`${s.person} ${from === "left" ? s.rvLeft : s.rvRight}`}>
      <HouseFrame orn={orn} a={a} src={mediaUrl(person.image)} small />
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
/**
 * Siluet punggung bukit: titik-titik [x, y] dalam satu periode 1440, diulang dua kali
 * supaya bisa digeser -50% tanpa sambungan, lalu dihaluskan dengan kurva.
 */
function ridgePath(points: readonly (readonly [number, number])[], width = 2880, period = 1440) {
  const all: [number, number][] = [];
  for (let off = 0; off < width; off += period) for (const [x, y] of points) all.push([x + off, y]);
  all.push([width, points[0][1]]);
  let d = `M0 ${all[0][1]}`;
  for (let i = 1; i < all.length; i++) {
    const [x0, y0] = all[i - 1];
    const [x1, y1] = all[i];
    const mx = (x0 + x1) / 2;
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
  }
  return `${d} V120 H0 Z`;
}

// Belakang: punggung gunung yang panjang dan landai. Depan: bukit kebun teh yang membulat.
const WAVE_BACK = ridgePath([[0, 70], [180, 48], [420, 30], [560, 34], [760, 26], [980, 52], [1180, 40], [1320, 60]]);
const WAVE_FRONT = ridgePath([[0, 92], [240, 72], [480, 90], [720, 70], [960, 88], [1200, 74]]);

/** Siluet bukit pemisah bagian terang dan gelap, dua lapis yang bergeser pelan. */
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

/** Judul bagian: aksara kecil di atas, judul, lalu pembatas emas. */
function Heading({
  orn,
  script,
  gap,
  children,
}: {
  orn: OrnamentAssets;
  script?: string;
  gap?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`${s.headingWrap} ${gap ? s.headingGap : ""}`}>
      {script ? (
        <p className={s.aksara} lang="su" aria-hidden="true">
          {script}
        </p>
      ) : null}
      <h2 className={s.heading}>{children}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.headingDivider} src={orn.divider} alt="" />
    </div>
  );
}

/** Judul kecil (kicker) dengan aksara di atasnya. */
function Kicker({ script, children }: { script?: string; children: ReactNode }) {
  return (
    <div className={s.kickerWrap}>
      {script ? (
        <p className={s.aksara} lang="su" aria-hidden="true">
          {script}
        </p>
      ) : null}
      <p className={s.kicker}>{children}</p>
    </div>
  );
}

/** Foto dalam bingkai rumah adat: atap emas di atas, bingkai kayu, untaian bunga menjuntai di kedua sisi. */
function HouseFrame({ orn, a, src, small }: { orn: OrnamentAssets; a: Assets; src?: string; small?: boolean }) {
  return (
    <div className={`${s.house} ${small ? s.houseSmall : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.houseRoof} src={orn.roof} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${s.houseGarland} ${s.houseGarlandLeft}`} src={orn.garland} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${s.houseGarland} ${s.houseGarlandRight}`} src={orn.garland} alt="" />
      <div className={s.houseBody}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={s.houseEmpty} src={a.clusterA} alt="" />
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.houseCluster} src={a.clusterB} alt="" />
    </div>
  );
}
