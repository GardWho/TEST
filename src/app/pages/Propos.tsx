import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1777133025718-ca8a34cdcd7d?w=1400&h=1800&fit=crop&auto=format&q=85";

const GALLERY_IMGS = {
  coaching: "https://images.unsplash.com/photo-1600715151005-e6d44b9ef840?w=1400&h=900&fit=crop&auto=format&q=85",
  misty:    "https://images.unsplash.com/photo-1759323200025-c5d3e68a77d7?w=900&h=700&fit=crop&auto=format&q=85",
  golden:   "https://images.unsplash.com/photo-1777133025718-ca8a34cdcd7d?w=1200&h=1600&fit=crop&auto=format&q=85",
  sunset:   "https://images.unsplash.com/photo-1772902540156-e298bcc8e3cc?w=900&h=1200&fit=crop&auto=format&q=85",
  arena:    "https://images.unsplash.com/photo-1726209431921-71cb661b4dbf?w=1400&h=900&fit=crop&auto=format&q=85",
};

export function Propos() {
  return (
    <div className="bg-[#F8F3EC]">

      {/* ── HERO split‑screen ── */}
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Colonne gauche : texte avec padding-top pour descendre sous la navbar */}
        <div className="flex flex-col justify-center px-10 md:px-20 lg:px-28 pb-20 md:pb-0 pt-24 md:pt-28 order-2 md:order-1">
          <div className="max-w-lg">
            <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-10">
              Parcours · Philosophie · Engagement
            </p>
            <h1
              className="text-5xl lg:text-[64px] font-normal leading-[1.04] mb-8 text-[#1C1814]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              À propos
            </h1>
            <div className="space-y-6 text-[15px] text-[#1C1814]/60 leading-relaxed font-light">
              <p>
                Avec plus de <strong>25 ans d'expérience</strong> dans le milieu équestre, j'ai développé une approche globale du cheval, alliant technique, bien-être et compréhension mutuelle.
              </p>
              <p>
                Mon parcours m'a menée à travailler auprès de nombreux cavaliers, du loisir à la compétition, en passant par l'éducation du jeune cheval et la rééducation des chevaux difficiles.
              </p>
              <p>
                Titulaire du CQPEAE (BPJEPS), du CCIEE et du CCPEE (anciennement BFE), je m'appuie sur une solide formation et une veille permanente pour vous offrir un enseignement de qualité.
              </p>
              <p>
                Je crois profondément qu'un cheval ne doit jamais être contraint mais compris. C'est pourquoi je place la relation, la confiance et le respect au cœur de mon travail.
              </p>
              <p>
                À travers mes cours, je souhaite transmettre bien plus qu'une technique : une philosophie de l'équitation qui replace le cheval en tant que partenaire sensible, dans une recherche constante de légèreté et d'harmonie.
              </p>
              <p className="text-[#C09A3C] font-medium italic" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1em" }}>
                — Roxane
              </p>
            </div>
          </div>
        </div>

        {/* Colonne droite : image pleine hauteur */}
        <div className="relative min-h-[60vw] md:min-h-screen order-1 md:order-2 bg-[#E8DDD0]">
          <img
            src={HERO_IMG}
            alt="Chevaux en liberté — RG Connexion Équine"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F8F3EC]/20" />
          <div className="absolute bottom-8 left-8 text-[10px] tracking-[0.35em] uppercase text-white/60">
            RG Connexion Équine
          </div>
        </div>
      </section>

      {/* ── GALERIE ── */}
      <section className="py-24 px-8 md:px-14 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-4 gap-3 items-end">
          <div className="col-span-2 h-[340px] overflow-hidden bg-[#D4C9B8] group">
            <img src={GALLERY_IMGS.coaching} alt="Coaching en action" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ filter: "sepia(12%)" }} />
          </div>
          <div className="h-[220px] overflow-hidden bg-[#D4C9B8] group">
            <img src={GALLERY_IMGS.misty} alt="Cheval dans la brume" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ filter: "sepia(18%)" }} />
          </div>
          <div className="h-[280px] overflow-hidden bg-[#D4C9B8] group">
            <img src={GALLERY_IMGS.golden} alt="Cheval au pré" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" style={{ filter: "sepia(14%)" }} />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-3">
          <div className="h-[200px] overflow-hidden bg-[#D4C9B8] group">
            <img src={GALLERY_IMGS.sunset} alt="Chevaux au coucher du soleil" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ filter: "sepia(16%)" }} />
          </div>
          <div className="col-span-2 h-[200px] flex flex-col items-center justify-center text-center px-8" style={{ background: "#EDE4D0" }}>
            <p className="text-[9px] tracking-[0.4em] uppercase mb-4" style={{ color: "#C09A3C" }}>Zones d'intervention</p>
            <p className="text-[13px] font-light" style={{ color: "rgba(28,24,20,0.55)" }}>
              Séances sur votre lieu d'équitation — région et alentours.
            </p>
          </div>
          <div className="h-[200px] overflow-hidden bg-[#D4C9B8] group">
            <img src={GALLERY_IMGS.arena} alt="Carrière d'équitation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ filter: "sepia(10%)" }} />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 text-center px-8 border-t" style={{ borderColor: "rgba(192,154,60,0.14)" }}>
        <p className="text-[9px] tracking-[0.48em] uppercase mb-7" style={{ color: "#C09A3C" }}>Commençons ensemble</p>
        <h2
          className="font-normal mb-10 text-[#1C1814]"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 4vw, 52px)" }}
        >
          Prêt à transformer<br /><em>votre relation équestre ?</em>
        </h2>
        <Link
          to="/contact"
          className="group inline-flex items-center gap-3 px-10 py-4 text-[10px] tracking-[0.28em] uppercase transition-all duration-300 hover:gap-5"
          style={{ background: "#1C1814", color: "#F5EFE4" }}
        >
          Prendre contact <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}