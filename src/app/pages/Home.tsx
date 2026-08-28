import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const I = {
  hero:    "/images/acceuil/acceuil3.jpg",
  golden:  "/images/acceuil/acceuil4.jpg",
  riding:  "/images/professionnels/professionnels3.jpg",
  quote:   "/images/bannières/banniere-04.webp",
};

const LogoCoaching = "/images/logo-prestations/coaching-cavalier.png";
const LogoTravail = "/images/logo-prestations/travail-cheval.png";
const LogoEducation = "/images/logo-prestations/education-equine.png";
const LogoConcours = "/images/logo-prestations/coaching-concours.png";
const LogoCollectif = "/images/logo-prestations/cours-collectifs.png";

const services = [
  {
    id: "coaching",
    title: "Coaching Cavalier",
    desc: "Cours particuliers, travail technique et accompagnement personnalisé.",
    link: "/cours",
    icon: LogoCoaching,
  },
  {
    id: "travail",
    title: "Travail du cheval",
    desc: "Éducation, rééducation, remise en confiance et travail spécifique.",
    link: "/travail-cheval",
    icon: LogoTravail,
  },
  {
    id: "education",
    title: "Débourrage & éducation",
    desc: "Mise en place des bases solides dans le respect du cheval.",
    link: "/education-equine",
    icon: LogoEducation,
  },
  {
    id: "concours",
    title: "Coaching concours",
    desc: "Préparation, stratégie, détente et suivi en compétition.",
    link: "/reeducation",
    icon: LogoConcours,
  },
  {
    id: "collectif",
    title: "Cours collectifs",
    desc: "Groupes de 2 à 10 cavaliers pour progresser ensemble.",
    link: "/cours",
    icon: LogoCollectif,
  },
];

export function Home() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (quoteRef.current) {
            const rect = quoteRef.current.getBoundingClientRect();
            const scrollProgress = 1 - (rect.top + rect.height / 2) / window.innerHeight;
            setOffset(Math.max(0, Math.min(scrollProgress * 30, 30)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <div style={{ background: "#F5EFE4" }}>

      {/* ── HERO ── */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-[#2A2318]">
        <img
          src={I.hero}
          alt="Cavalière dans la forêt"
          onLoad={() => setImgLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover object-[center_50%] transition-opacity duration-700"
          style={{ opacity: imgLoaded ? 0.72 : 0, filter: "sepia(18%) saturate(1.1)" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814]/80 via-transparent to-[#1C1814]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1814]/40 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-20 pb-16 md:pb-20">
          <div className="max-w-[680px]">
            <p className="text-[9px] tracking-[0.5em] uppercase mb-6" style={{ color: "#C09A3C" }}>
              Enseignante Équestre Diplômée d'État
            </p>
            <h1
              className="font-normal leading-[0.96] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 56px)",
                color: "#F5EFE4",
              }}
            >
              R.G. ÉQUITATION & ÉDUCATION ÉQUINE
            </h1>

            <div className="flex items-center gap-6 flex-wrap">
              <Link
                to="/prestations"
                className="group flex items-center gap-3 text-[10px] tracking-[0.28em] uppercase px-7 py-3 transition-all duration-300 hover:gap-4"
                style={{ background: "#C09A3C", color: "#F5EFE4" }}
              >
                Découvrir les prestations
              </Link>
              <Link
                to="/a-propos"
                className="text-[10px] tracking-[0.28em] uppercase text-white/50 hover:text-white/80 transition-colors border-b border-white/20 pb-0.5"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-10 flex flex-col items-center gap-2">
          <span className="text-[8px] tracking-[0.4em] uppercase" style={{ color: "rgba(192,154,60,0.5)", writingMode: "vertical-rl" }}>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#C09A3C]/40 to-transparent" />
        </div>
      </section>

      {/* ── PRESTATIONS ── */}
      <section className="bg-white border-y border-[#C09A3C]/15 py-16">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-3">PRESTATIONS</p>
            <h2 className="text-3xl md:text-4xl font-normal text-[#1C1814]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Un accompagnement <em>sur mesure</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {services.map((s) => (
              <Link
                key={s.id}
                to={s.link}
                className="group bg-[#FDF8F0] p-5 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="flex justify-center mb-3">
                  <img src={s.icon} alt={s.title} className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-normal mb-1 text-[#1C1814] group-hover:text-[#C09A3C] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {s.title}
                </h3>
                <p className="text-[12px] text-[#1C1814]/50 leading-relaxed font-light">{s.desc}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-[9px] tracking-[0.25em] uppercase text-[#C09A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Découvrir
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── À PROPOS ACCUEIL ── */}
      <section className="bg-[#EDE4D3] py-20">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative">
              <img src={I.riding} alt="Raphaëlle G. — Monitrice équestre" className="w-full h-[400px] md:h-[500px] object-cover object-top" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#C09A3C]/30 hidden md:block" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-6">À Propos</p>
              <h2 className="text-3xl md:text-4xl font-normal leading-[1.08] mb-6 text-[#1C1814]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Parce qu'une véritable progression commence par la compréhension.
              </h2>
              <div className="space-y-3 text-[14px] text-[#1C1814]/70 leading-relaxed font-light">
                <p>Chaque cheval a son histoire, son fonctionnement et ses propres difficultés. Chaque cavalier arrive également avec son expérience, ses habitudes, ses ressentis et ses objectifs. Mon travail commence par observer le cheval, écouter le cavalier et comprendre leur fonctionnement, afin de proposer un accompagnement adapté à chacun.</p>
                <p>Mon approche s'appuie notamment sur l'éthologie, en tant que science du comportement, associée à l'éducation et à un travail technique respectueux de la biomécanique. À pied comme monté, je cherche à construire des bases solides : un cheval disponible, équilibré et capable de comprendre ce qui lui est demandé, mais aussi un cavalier qui apprend à mieux lire son cheval, à affiner ses aides et à gagner en précision.</p>
                <p>Du jeune cheval au cheval rencontrant des difficultés, chaque séance s'inscrit dans une progression adaptée au couple. L'objectif : améliorer la communication, préserver l'équilibre physique et émotionnel du cheval et permettre au cavalier de progresser avec lui, du loisir à la compétition.</p>
              </div>
              <Link to="/a-propos" className="group inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#1C1814] border-b border-[#1C1814]/30 pb-0.5 hover:border-[#C09A3C] hover:text-[#C09A3C] transition-all duration-300 mt-6">
                Découvrir le parcours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE BANNER ── */}
      <section ref={quoteRef} className="relative py-20 text-center px-8 overflow-hidden bg-[#2A2318]">
        <div className="absolute inset-0 bg-[#2A2318]" />
        <div className="absolute inset-0">
          <img
            src={I.quote}
            alt="Cheval au coucher du soleil"
            loading="eager"
            className="w-full h-full object-cover transition-transform duration-200 will-change-transform"
            style={{
              transform: `translateY(${offset}px) scale(1.05)`,
              opacity: 0.6,
              filter: "sepia(20%) saturate(0.9)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814]/70 via-[#1C1814]/30 to-[#1C1814]/50" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-px h-10 bg-[#C09A3C]/50 mx-auto mb-8" />
          <blockquote className="text-2xl md:text-3xl font-normal italic text-[#F5EFE4] leading-[1.2] mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            « L'équitation est une danse d'équilibre qui se construit entre le cheval et le cavalier. »
          </blockquote>
          <div className="w-px h-10 bg-[#C09A3C]/50 mx-auto mb-6" />
          <Link to="/contact" className="group inline-flex items-center gap-3 px-8 py-3 bg-[#C09A3C] text-[#FDFAF5] text-[11px] tracking-[0.25em] uppercase hover:bg-[#F5EFE4] hover:text-[#1C1814] transition-colors duration-300">
            Réserver une séance
          </Link>
        </div>
      </section>

      {/* ── ZONES D'INTERVENTION ── */}
      <section className="py-20 px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[320px] md:h-[400px] overflow-hidden rounded-sm">
            <img src={I.golden} alt="Zones d'intervention" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-[11px] tracking-[0.35em] uppercase text-[#C09A3C] mb-1">RELATION • LÉGÈRETÉ • PERFORMANCE</p>
            <p className="text-[13px] text-[#1C1814]/50 font-light italic mb-4">Du comportement à la performance</p>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#C09A3C] mb-3">Zones d'intervention</p>
            <p className="text-[14px] text-[#1C1814]/60 leading-relaxed font-light max-w-md">sur votre lieu d'équitation - Bordeaux et alentours (15 premiers km inclus).</p>
            <div className="mt-6 border border-[#C09A3C]/25 p-5 w-full max-w-md">
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#C09A3C] mb-2">SUIVEZ-NOUS SUR INSTAGRAM</p>
<a href="https://www.instagram.com/rgequitationeducationequine" target="_blank" rel="noopener noreferrer" className="text-[14px] font-light text-[#C09A3C]">
  @rgequitationeducationequine
</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}