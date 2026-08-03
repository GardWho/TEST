import { Link } from "react-router-dom";

const heroImg =
  "/images/débourage-education/débourage-education2.jpg";

export function EducationEquinePage() {
  return (
    <div className="bg-[#F5EFE4] min-h-screen">
      {/* HERO */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden bg-[#2A2318]">
        <img
          src={heroImg}
          alt="Débourrage & éducation"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "sepia(18%) saturate(0.9)", opacity: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814]/70 via-transparent to-[#1C1814]/30" />
        <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-20 pb-10">
          <p className="text-[9px] tracking-[0.48em] uppercase mb-3" style={{ color: "#C09A3C" }}>
            Prestations
          </p>
          <h1
            className="font-normal leading-[1.0] text-[#F5EFE4]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Débourrage & éducation
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-14 py-16">
        <section>
          <h2
            className="text-3xl md:text-4xl font-normal text-[#C09A3C] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Débourrage & éducation
          </h2>
          <div className="space-y-4 text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-8 max-w-2xl">
            <p>
              Le débourrage est une étape essentielle dans la vie du cheval. Il pose les bases de sa future relation avec l'humain, de sa confiance ainsi que de son équilibre physique et émotionnel. Mon approche s'appuie sur les principes de l'équitation éthologique et sur l'observation du comportement du cheval. Chaque apprentissage est introduit progressivement, dans le respect de son rythme, de sa compréhension et de ses capacités. L'objectif est de construire une communication claire et des bases solides, afin de former un cheval serein, attentif et disponible, capable d'évoluer avec confiance aux côtés de l'humain.
            </p>
          </div>

          {/* Lien vers contact pour devis */}
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-[#1C1814] text-[#F5EFE4] text-[11px] tracking-[0.25em] uppercase hover:bg-[#C09A3C] transition-colors duration-300"
          >
            À partir de 800€ - Demandez un devis
          </Link>
        </section>

        <p className="text-[11px] text-[#1C1814]/40 font-light italic border-t pt-6 mt-12 border-[#C09A3C]/15">
          Déplacement inclus dans les 15 premiers kilomètres · Au-delà : 0,50 € par kilomètre
        </p>
      </div>
    </div>
  );
}