import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1600715151005-e6d44b9ef840?w=1400&h=900&fit=crop&auto=format&q=85";

const services = [
  {
    num: "01",
    title: "Cours",
    sub: "Cours particuliers et collectifs, du loisir à la compétition, adaptés à vos objectifs et à votre niveau.",
    img: "https://images.unsplash.com/photo-1600715151005-e6d44b9ef840?w=1400&h=900&fit=crop&auto=format&q=85",
    link: "/cours",
  },
  {
    num: "02",
    title: "Travail du cheval",
    sub: "Travail monté ou à pied, préparation physique et mentale de votre cheval.",
    img: "https://images.unsplash.com/photo-1777133025718-ca8a34cdcd7d?w=1200&h=1600&fit=crop&auto=format&q=85",
    link: "/travail-cheval",
  },
  {
    num: "03",
    title: "Rééducation",
    sub: "Résolution des troubles comportementaux, remise en confiance et travail de fond.",
    img: "https://images.unsplash.com/photo-1567454931110-f321b2795990?w=800&h=1100&fit=crop&auto=format&q=85",
    link: "/reeducation",
  },
  {
    num: "04",
    title: "Éducation équine",
    sub: "Débourrage et éducation du jeune cheval dans le respect de ses capacités et de son rythme.",
    img: "https://images.unsplash.com/photo-1772902540156-e298bcc8e3cc?w=900&h=1200&fit=crop&auto=format&q=85",
    link: "/education-equine",
  },
];

export function Prestations() {
  return (
    <div style={{ background: "#F5EFE4" }}>
      {/* ── HERO ── */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden bg-[#2A2318]">
        <img
          src={HERO_IMG}
          alt="Prestations équestres"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "sepia(18%) saturate(0.9)", opacity: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814]/70 via-transparent to-[#1C1814]/30" />
        <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-20 pb-16">
          <p className="text-[9px] tracking-[0.48em] uppercase mb-5" style={{ color: "#C09A3C" }}>
            Prestations
          </p>
          <h1
            className="font-normal leading-[1.0] text-[#F5EFE4]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 7vw, 88px)" }}
          >
            Un accompagnement<br />
            <em style={{ color: "#C09A3C" }}>taillé sur mesure</em>
          </h1>
        </div>
      </div>

      {/* ── SERVICES (4 cartes) ── */}
      <section className="bg-[#EDE4D0] py-20">
        <div className="max-w-[1400px] mx-auto px-8 md:px-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {services.map((s) => (
              <Link
                key={s.num}
                to={s.link}
                className="group bg-[#F8F3EC] overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 overflow-hidden bg-[#D4C9B8]">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ filter: "sepia(12%)" }}
                  />
                  <span className="absolute top-4 left-4 text-[9px] tracking-[0.35em] uppercase text-[#C09A3C] bg-white/80 px-2 py-1">
                    {s.num}
                  </span>
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-normal text-[#1C1814] mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-[13px] text-[#1C1814]/60 leading-relaxed font-light">{s.sub}</p>
                  <div className="mt-4 flex items-center gap-1 text-[9px] tracking-[0.25em] uppercase text-[#C09A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Découvrir <ArrowRight size={9} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION PROFESSIONNELS ── */}
      <section className="py-24 text-center px-8 bg-[#FDFAF5] border-y border-[#C09A3C]/15">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-6">
            Pour les professionnels
          </p>
          <h2
            className="text-4xl md:text-5xl font-normal leading-[1.1] text-[#1C1814] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Un accompagnement<br />
            <em>sur mesure pour vos structures</em>
          </h2>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-10">
            Que vous soyez centre équestre, éleveur ou cavalier professionnel, je propose
            des prestations adaptées à vos besoins spécifiques : formation des cavaliers,
            travail des jeunes chevaux, rééducation, suivi en compétition, ou
            accompagnement pédagogique de vos équipes.
          </p>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-12">
            Contactez‑moi pour discuter de votre projet et construire ensemble une
            solution sur mesure.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#C09A3C] text-[#FDFAF5] text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors duration-300"
          >
            Prendre contact
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}