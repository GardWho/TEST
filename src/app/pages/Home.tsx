import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";  // ← Ajout de useRef, useEffect

const I = {
  hero:    "/images/acceuil/acceuil.png",
  golden:  "/images/acceuil/acceuil4.jpg",
  sunset:  "https://images.unsplash.com/photo-1772902540156-e298bcc8e3cc?w=900&h=1200&fit=crop&auto=format&q=85",
  riding:  "/images/acceuil/acceuil3.jpg",
  coaching:"https://images.unsplash.com/photo-1600715151005-e6d44b9ef840?w=1400&h=900&fit=crop&auto=format&q=85",
  arena:   "https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?w=1400&h=900&fit=crop&auto=format&q=85",
  field:   "https://images.unsplash.com/photo-1778652688765-dd2d6c028854?w=1600&h=700&fit=crop&auto=format&q=85",
  misty:   "https://images.unsplash.com/photo-1759323200025-c5d3e68a77d7?w=900&h=700&fit=crop&auto=format&q=85",
  quote:   "/images/acceuil/acceuil2.png",
};

// Import des logos PNG
// Les logos sont dans public/images/logo-prestations/
const LogoCoaching = "/images/logo-prestations/coaching-cavalier.png";
const LogoTravail = "/images/logo-prestations/travail-cheval.png";
const LogoEducation = "/images/logo-prestations/education-equine.png";
const LogoConcours = "/images/logo-prestations/coaching-concours.png";
const LogoCollectif = "/images/logo-prestations/cours-collectifs.png";

// Liste des services avec logos PNG
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
    title: "Éducation équine",
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

  // Effet parallaxe pour la section citation (déplacement de l'image)
  useEffect(() => {
    const handleScroll = () => {
      if (quoteRef.current) {
        const rect = quoteRef.current.getBoundingClientRect();
        const scrollProgress = 1 - (rect.top + rect.height / 2) / window.innerHeight;
        setOffset(scrollProgress * 40); // Déplacement de 40px max
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: "#F5EFE4" }}>

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[680px] overflow-hidden bg-[#2A2318]">
        <img
          src={I.hero}
          alt="Cavalière dans la forêt"
          onLoad={() => setImgLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
          style={{ opacity: imgLoaded ? 0.72 : 0, filter: "sepia(18%) saturate(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814]/80 via-transparent to-[#1C1814]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1814]/40 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-20 pb-20 md:pb-28">
          <div className="max-w-[680px]">
            <p className="text-[9px] tracking-[0.5em] uppercase mb-8" style={{ color: "#C09A3C" }}>
              Monitrice Équestre Diplômée d'État
            </p>
            <h1
              className="font-normal leading-[0.96] mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 56px)",
                color: "#F5EFE4",
              }}
            >
              R.G EQUITATION ET EDUCATION EQUINE
            </h1>

            <div className="flex items-center gap-8 flex-wrap">
              <Link
                to="/prestations"
                className="group flex items-center gap-3 text-[10px] tracking-[0.28em] uppercase px-7 py-3.5 transition-all duration-300 hover:gap-4"
                style={{ background: "#C09A3C", color: "#F5EFE4" }}
              >
                Découvrir les prestations <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
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

        <div className="absolute bottom-8 right-10 flex flex-col items-center gap-2">
          <span className="text-[8px] tracking-[0.4em] uppercase" style={{ color: "rgba(192,154,60,0.5)", writingMode: "vertical-rl" }}>Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#C09A3C]/40 to-transparent" />
        </div>
      </section>

      {/* ── PRESTATIONS ── */}
      <section className="bg-white border-y border-[#C09A3C]/15 py-24">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-4">PRESTATIONS</p>
            <h2
              className="text-3xl md:text-4xl font-normal text-[#1C1814]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Un accompagnement <em>sur mesure</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {services.map((s) => (
              <Link
                key={s.id}
                to={s.link}
                className="group bg-[#FDF8F0] p-6 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={s.icon}
                    alt={s.title}
                    className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3
                  className="text-lg font-normal mb-2 text-[#1C1814] group-hover:text-[#C09A3C] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-[13px] text-[#1C1814]/50 leading-relaxed font-light">{s.desc}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-[9px] tracking-[0.25em] uppercase text-[#C09A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Découvrir <ArrowRight size={9} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── À PROPOS ACCUEIL ── */}
      <section className="bg-[#EDE4D3] py-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative">
              <img
                src={I.riding}
                alt="Raphaëlle G. — Monitrice équestre"
                className="w-full h-[500px] md:h-[640px] object-cover object-top"
              />
              <div className="absolute -bottom-5 -right-5 w-32 h-32 border border-[#C09A3C]/30 hidden md:block" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-8">À Propos</p>
              <h2
                className="text-4xl md:text-5xl font-normal leading-[1.08] mb-8 text-[#1C1814]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Parce qu'une véritable progression commence par la compréhension.
              </h2>
              <div className="space-y-4 text-[15px] text-[#1C1814]/70 leading-relaxed font-light">
                <p>
                  Chaque cheval a son histoire, son fonctionnement et ses propres difficultés. Chaque cavalier arrive également avec son expérience, ses habitudes, ses ressentis et ses objectifs. Mon travail commence par observer le cheval, écouter le cavalier et comprendre leur fonctionnement, afin de proposer un accompagnement adapté à chacun.
                </p>
                <p>
                  Mon approche s'appuie notamment sur l'éthologie, en tant que science du comportement, associée à l'éducation et à un travail technique respectueux de la biomécanique. À pied comme monté, je cherche à construire des bases solides : un cheval disponible, équilibré et capable de comprendre ce qui lui est demandé, mais aussi un cavalier qui apprend à mieux lire son cheval, à affiner ses aides et à gagner en précision.
                </p>
                <p>
                  Du jeune cheval au cheval rencontrant des difficultés, chaque séance s'inscrit dans une progression adaptée au couple. L'objectif : améliorer la communication, préserver l'équilibre physique et émotionnel du cheval et permettre au cavalier de progresser avec lui, du loisir à la compétition.
                </p>
              </div>
              <Link
                to="/a-propos"
                className="group inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#1C1814] border-b border-[#1C1814]/30 pb-0.5 hover:border-[#C09A3C] hover:text-[#C09A3C] transition-all duration-300 mt-8"
              >
                Découvrir le parcours <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE BANNER avec parallaxe (image plus claire) ── */}
      <section ref={quoteRef} className="relative py-28 text-center px-8 overflow-hidden bg-[#2A2318]">
        {/* Image de fond avec parallaxe */}
        <div className="absolute inset-0">
          <img
            src={I.quote}
            alt="Cheval au coucher du soleil"
            className="w-full h-full object-cover transition-transform duration-100"
            style={{
              transform: `translateY(${offset}px) scale(1.1)`,
              opacity: 0.55, // Augmenté de 0.35 à 0.55 pour plus de visibilité
              filter: "sepia(20%) saturate(0.9)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814]/70 via-[#1C1814]/30 to-[#1C1814]/50" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-px h-12 bg-[#C09A3C]/50 mx-auto mb-10" />
          <blockquote
            className="text-3xl md:text-4xl font-normal italic text-[#F5EFE4] leading-[1.2] mb-10"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            « L'équitation est une danse d'équilibre qui se construit ensemble. »
          </blockquote>
          <div className="w-px h-12 bg-[#C09A3C]/50 mx-auto mb-8" />
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#C09A3C] text-[#FDFAF5] text-[11px] tracking-[0.25em] uppercase hover:bg-[#F5EFE4] hover:text-[#1C1814] transition-colors duration-300"
          >
            Réserver une séance
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── ZONES D'INTERVENTION (centrée, avec acceuil4.jpg) ── */}
      <section className="py-32 px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image (acceuil4.jpg) */}
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-sm">
            <img
              src={I.golden}
              alt="Zones d'intervention"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenu centré */}
          <div className="flex flex-col items-center text-center">
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#C09A3C] mb-4">
              Zones d'intervention
            </p>
            <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light max-w-md">
              sur votre lieu d'équitation - Bordeaux et alentours (15 premiers km inclus).
            </p>
            <div className="mt-6 border border-[#C09A3C]/25 p-6 w-full max-w-md">
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#C09A3C] mb-2">
                Niveaux accueillis
              </p>
              <p className="text-[13px] text-[#1C1814]/60 leading-relaxed font-light">
                Du premier contact avec le cheval jusqu'à la préparation à la haute compétition.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}