import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const I = {
  hero:    "https://images.unsplash.com/photo-1511746687876-42cb762f6ac1?w=2000&h=1200&fit=crop&auto=format&q=90",
  golden:  "https://images.unsplash.com/photo-1777133025718-ca8a34cdcd7d?w=1200&h=1600&fit=crop&auto=format&q=85",
  sunset:  "https://images.unsplash.com/photo-1772902540156-e298bcc8e3cc?w=900&h=1200&fit=crop&auto=format&q=85",
  riding:  "https://images.unsplash.com/photo-1567454931110-f321b2795990?w=800&h=1100&fit=crop&auto=format&q=85",
  coaching:"https://images.unsplash.com/photo-1600715151005-e6d44b9ef840?w=1400&h=900&fit=crop&auto=format&q=85",
  arena:   "https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?w=1400&h=900&fit=crop&auto=format&q=85",
  field:   "https://images.unsplash.com/photo-1778652688765-dd2d6c028854?w=1600&h=700&fit=crop&auto=format&q=85",
  misty:   "https://images.unsplash.com/photo-1759323200025-c5d3e68a77d7?w=900&h=700&fit=crop&auto=format&q=85",
};

// Nouvelle liste des services (5 au lieu des 3 piliers)
const services = [
  {
    num: "01",
    title: "Coaching Cavalier",
    desc: "Cours particuliers, travail technique et accompagnement personnalisé.",
    link: "/cours",
  },
  {
    num: "02",
    title: "Travail du cheval",
    desc: "Éducation, rééducation, remise en confiance et travail spécifique.",
    link: "/travail-cheval",
  },
  {
    num: "03",
    title: "Éducation équine",
    desc: "Mise en place des bases solides dans le respect du cheval.",
    link: "/education-equine",
  },
  {
    num: "04",
    title: "Coaching concours",
    desc: "Préparation, stratégie, détente et suivi en compétition.",
    link: "/reeducation",
  },
  {
    num: "05",
    title: "Cours collectifs",
    desc: "Groupes de 2 à 10 cavaliers pour progresser ensemble.",
    link: "/cours",
  },
];

export function Home() {
  const [imgLoaded, setImgLoaded] = useState(false);

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
                fontSize : "clamp(38px, 6vw, 76px)",
                color: "#F5EFE4",
              }}
            >
              R.G EQUITATION ET EDUCATION EQUINE<br />
              <em style={{ color: "#C09A3C" }}>Une équitation fondée sur la compréhension et la légèreté<br>
      Former le cheval, accompagner le cavalier
    </br></em>
              
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

      {/* ── SERVICES (5 au lieu de 3) ── */}
      <section className="bg-[#FDFAF5] border-y border-[#C09A3C]/15 py-24">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-4">Nos prestations</p>
            <h2
              className="text-3xl md:text-4xl font-normal text-[#1C1814]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Un accompagnement <em>sur mesure</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {services.map((s, i) => (
              <Link
                key={s.num}
                to={s.link}
                className="group bg-white p-6 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-[9px] tracking-[0.5em] uppercase text-[#C09A3C] block mb-4">{s.num}</span>
                <h3
                  className="text-lg font-normal mb-2 text-[#1C1814] group-hover:text-[#C09A3C] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-[13px] text-[#1C1814]/50 leading-relaxed font-light">{s.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-[9px] tracking-[0.25em] uppercase text-[#C09A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Découvrir <ArrowRight size={9} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── À PROPOS TEASER ── */}
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
                Une approche<br />
                <em>humaine et technique</em>
              </h2>
              <p className="text-[15px] text-[#1C1814]/55 leading-relaxed font-light mb-6">
                Raphaëlle G. est monitrice équestre diplômée d'État, passionnée par le comportement équin et l'accompagnement des cavaliers dans leur relation à leur cheval.
              </p>
              <p className="text-[15px] text-[#1C1814]/55 leading-relaxed font-light mb-12">
                Sa pédagogie s'appuie sur une connaissance approfondie de l'éthologie et un regard attentif à chaque duo, pour progresser avec justesse et bienveillance.
              </p>
              <Link
                to="/a-propos"
                className="group inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#1C1814] border-b border-[#1C1814]/30 pb-0.5 hover:border-[#C09A3C] hover:text-[#C09A3C] transition-all duration-300"
              >
                Découvrir le parcours <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE BANNER ── */}
      <section className="py-28 text-center px-8">
        <div className="max-w-3xl mx-auto">
          <div className="w-px h-12 bg-[#C09A3C]/30 mx-auto mb-10" />
          <blockquote
            className="text-3xl md:text-4xl font-normal italic text-[#1C1814] leading-[1.2] mb-10"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "La légèreté n'est pas un but — c'est la conséquence d'une relation juste."
          </blockquote>
          <div className="w-px h-12 bg-[#C09A3C]/30 mx-auto mb-8" />
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#C09A3C] text-[#FDFAF5] text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors duration-300"
          >
            Réserver une séance
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── THIRD IMAGE ROW ── */}
      <section className="pb-32 px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="col-span-2 bg-[#E8DDD0] h-[320px] md:h-[420px]">
            <img
              src={I.golden}
              alt="Cavalière et cheval"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-end gap-4">
            <div className="bg-[#EDE4D3] p-8 md:p-10">
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#C09A3C] mb-4">Zones d'intervention</p>
              <p className="text-[13px] text-[#1C1814]/60 leading-relaxed font-light">
                Interventions sur votre lieu d'équitation, en toute flexibilité.
              </p>
            </div>
            <div className="border border-[#C09A3C]/25 p-8 md:p-10">
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#C09A3C] mb-4">Niveaux accueillis</p>
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