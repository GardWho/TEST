import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// ✅ Image recadrée pour cacher la tête
const HERO_IMG = "/images/professionnels/professionnels.jpg";

// Images de la galerie (1 à 15)
const galerieImages = Array.from({ length: 15 }, (_, i) => ({
  src: `/images/galerie/galerie${i + 1}.jpg`,
  alt: `Galerie ${i + 1}`,
}));

const displayImages = galerieImages;

export function Propos() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#F8F3EC]">

      {/* ── HERO split‑screen ── */}
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-10 md:px-20 lg:px-28 pb-20 md:pb-0 pt-24 md:pt-28 order-2 md:order-1">
          <div className="max-w-lg">
            {/* ✅ PARCOURS en ligne - sans "Approche" doré */}
            <p className="text-[9px] tracking-[0.35em] uppercase text-[#C09A3C] mb-10 flex flex-wrap gap-2">
              <span>Parcours</span>
              <span className="text-[#C09A3C]/40">·</span>
              <span>Philosophie</span>
              <span className="text-[#C09A3C]/40">·</span>
              <span>Engagement</span>
            </p>
            <h1
              className="text-5xl lg:text-[64px] font-normal leading-[1.04] mb-8 text-[#1C1814]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              À propos
            </h1>
            <div className="space-y-6 text-[15px] text-[#1C1814]/60 leading-relaxed font-light">
              <p>
                Avec plus de 25 ans d'expérience dans le milieu équestre, j'ai développé une approche globale du cheval, alliant technique, bien-être et compréhension mutuelle.
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
              {/* ✅ Deuxième paragraphe centré */}
              <p>
                À travers mes cours, je souhaite transmettre bien plus qu'une technique : une philosophie de l'équitation qui replace le cheval en tant que partenaire sensible, dans une recherche constante de légèreté et d'harmonie.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Colonne droite : image recadrée pour cacher la tête */}
        <div className="relative min-h-[60vw] md:min-h-screen order-1 md:order-2 bg-[#E8DDD0] overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Professionnels — RG Connexion Équine"
            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F8F3EC]/20" />
          <div className="absolute bottom-8 left-8 text-[10px] tracking-[0.35em] uppercase text-white/60">
          </div>
        </div>
      </section>

      {/* ── SECTION : Approche (sans le texte "Approche" doré) ── */}
      <section className="py-24 px-8 md:px-20 max-w-[1400px] mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-normal leading-[1.08] mb-8 text-[#1C1814]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Approche de l'éducation<br />et de la rééducation
          </h2>
          <div className="space-y-4 text-[15px] text-[#1C1814]/60 leading-relaxed font-light">
            <p>
              Chaque cheval possède son histoire, sa sensibilité et ses modes d'apprentissage. Mon intervention s'adapte à sa personnalité, à son niveau et aux objectifs de son propriétaire.
            </p>
            <p>
              J'interviens sur différentes problématiques : manque de confiance, stress, difficultés à la monte, raideurs, refus d'obstacle ou comportements devenus problématiques, voire dangereux.
            </p>
            <p>
              Mon travail s'appuie notamment sur l'éthologie, en tant que science du comportement. L'objectif est d'observer et de comprendre les réactions du cheval, son état émotionnel, son environnement et ses mécanismes d'apprentissage, afin d'identifier l'origine de la difficulté plutôt que d'en corriger uniquement la manifestation.
            </p>
            <p>
              Il ne s'agit jamais de « soumettre » le cheval, mais de lui proposer des réponses claires et cohérentes pour l'aider à comprendre ce qui est attendu de lui. Je cherche ainsi à restaurer sa confiance, sa disponibilité et sa sérénité, indispensables à un travail juste et durable.
            </p>
            <p className="text-[#C09A3C] font-light italic">
              La légèreté, la cohérence et la progressivité restent au cœur de chaque accompagnement.
            </p>
            <p className="text-[#C09A3C] font-medium italic text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1em" }}>
                — Roxane
            </p>
          </div>
        </div>
      </section>

      {/* ── GALERIE ── */}
      <section className="py-24 px-8 md:px-14 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-4 gap-3 items-end">
          <div className="col-span-2 h-[340px] overflow-hidden bg-[#D4C9B8] group relative">
            <img
              src={displayImages[currentIndex].src}
              alt={displayImages[currentIndex].alt}
              className="w-full h-full object-cover transition-opacity duration-1000"
              style={{ filter: "sepia(12%)" }}
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {displayImages.slice(0, 5).map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex % 5 ? "w-6 bg-[#C09A3C]" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="h-[220px] overflow-hidden bg-[#D4C9B8] group">
            <img
              src={displayImages[(currentIndex + 1) % displayImages.length].src}
              alt={displayImages[(currentIndex + 1) % displayImages.length].alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              style={{ filter: "sepia(18%)" }}
            />
          </div>
          <div className="h-[280px] overflow-hidden bg-[#D4C9B8] group">
            <img
              src={displayImages[(currentIndex + 2) % displayImages.length].src}
              alt={displayImages[(currentIndex + 2) % displayImages.length].alt}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              style={{ filter: "sepia(14%)" }}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-3">
          <div className="h-[200px] overflow-hidden bg-[#D4C9B8] group">
            <img
              src={displayImages[(currentIndex + 3) % displayImages.length].src}
              alt={displayImages[(currentIndex + 3) % displayImages.length].alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              style={{ filter: "sepia(16%)" }}
            />
          </div>
          <div className="col-span-2 h-[200px] flex flex-col items-center justify-center text-center px-8" style={{ background: "#EDE4D0" }}>
            <p className="text-[9px] tracking-[0.4em] uppercase mb-4" style={{ color: "#C09A3C" }}>Zones d'intervention</p>
            <p className="text-[13px] font-light" style={{ color: "rgba(28,24,20,0.55)" }}>
              sur votre lieu d'équitation - Bordeaux et alentours (15 premiers km inclus).
            </p>
          </div>
          <div className="h-[200px] overflow-hidden bg-[#D4C9B8] group">
            <img
              src={displayImages[(currentIndex + 4) % displayImages.length].src}
              alt={displayImages[(currentIndex + 4) % displayImages.length].alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              style={{ filter: "sepia(10%)" }}
            />
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