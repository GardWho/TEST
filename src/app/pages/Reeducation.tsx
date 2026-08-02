import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";

const heroImg =
  "images/réeducation/réeducation.jpg";

export function ReeducationPage() {
  const { addItem } = useCart();

  return (
    <div className="bg-[#F5EFE4] min-h-screen">
      {/* HERO */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden bg-[#2A2318]">
        <img
          src={heroImg}
          alt="Rééducation équine"
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
            Rééducation équine
          </h1>
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-14 py-16">
        
        {/* ── SECTION BILAN en fond noir ── */}
        <section className="mb-20 bg-[#1C1814] p-10 md:p-16 rounded-sm">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-4">
              LA PREMIÈRE ÉTAPE
            </p>
            <h2
              className="text-4xl md:text-5xl font-normal text-[#F5EFE4] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Bilan de rééducation
            </h2>
            <p className="text-[15px] text-[#F5EFE4]/80 leading-relaxed font-light mb-8 max-w-2xl">
              Cette première rencontre permet d'observer le cheval dans son environnement, d'échanger sur son histoire et d'analyser les difficultés rencontrées. À l'issue du bilan, je vous propose un accompagnement adapté au cheval, au cavalier et aux objectifs recherchés.
            </p>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#C09A3C]/70 mb-1">Durée</p>
                <p className="text-2xl font-medium text-[#F5EFE4]">1H30</p>
              </div>
              <div className="w-px h-10 bg-[#C09A3C]/30" />
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#C09A3C]/70 mb-1">Tarif</p>
                <p className="text-3xl font-medium text-[#C09A3C]">80 €</p>
              </div>
            </div>
            <button
              onClick={() => addItem("Bilan rééducation (1h30)", 80, "reeducation")}
              className="mt-8 px-8 py-3 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-[#1C1814] hover:bg-[#F5EFE4] transition-colors font-medium"
            >
              Ajouter au panier
            </button>
          </div>
        </section>

        {/* ── SECTION FORMULES ── */}
        <section className="max-w-4xl">
          <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-4">
            Après le bilan
          </p>
          <h2
            className="text-4xl md:text-5xl font-normal text-[#1C1814] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Les formules d'accompagnement
          </h2>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-12 max-w-2xl">
            À la suite du bilan, plusieurs formules mensuelles peuvent être proposées. Les séances peuvent associer travail du cheval, accompagnement du cavalier et travail du couple, selon les besoins identifiés.
          </p>

          <div className="space-y-8">
            {/* Formule 1 */}
            <div className="bg-[#EDE4D0] p-8 rounded-sm hover:bg-[#E8DDD0] transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h3
                  className="text-2xl font-normal text-[#1C1814]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Découverte de l'approche
                </h3>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#1C1814]/50">
                    1 séance par semaine
                  </span>
                  <span className="text-2xl font-medium text-[#C09A3C]">280 € /mois</span>
                </div>
              </div>
              <p className="text-[14px] text-[#1C1814]/60 leading-relaxed font-light">
                Pour amorcer le travail, découvrir mon approche et mettre en place les premières réponses face à une difficulté ciblée.
              </p>
            </div>

            {/* Formule 2 */}
            <div className="bg-[#EDE4D0] p-8 rounded-sm hover:bg-[#E8DDD0] transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h3
                  className="text-2xl font-normal text-[#1C1814]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Suivi régulier
                </h3>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#1C1814]/50">
                    2 séances par semaine
                  </span>
                  <span className="text-2xl font-medium text-[#C09A3C]">420 € /mois</span>
                </div>
              </div>
              <p className="text-[14px] text-[#1C1814]/60 leading-relaxed font-light">
                Pour installer de nouveaux apprentissages, accompagner leur évolution et permettre au cheval comme au cavalier de progresser avec régularité.
              </p>
            </div>

            {/* Formule 3 */}
            <div className="bg-[#EDE4D0] p-8 rounded-sm hover:bg-[#E8DDD0] transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h3
                  className="text-2xl font-normal text-[#1C1814]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Rééducation intensive
                </h3>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#1C1814]/50">
                    3 séances par semaine
                  </span>
                  <span className="text-2xl font-medium text-[#C09A3C]">780 € /mois</span>
                </div>
              </div>
              <p className="text-[14px] text-[#1C1814]/60 leading-relaxed font-light">
                Pour les problématiques plus importantes, anciennes ou présentant un enjeu de sécurité. La fréquence des séances permet d'assurer une progression suivie, cohérente et durable.
              </p>
            </div>
          </div>

          <p className="text-[14px] text-[#1C1814]/50 leading-relaxed font-light italic mt-6">
            Le rythme et le contenu de l'accompagnement sont définis après le bilan.
          </p>

          <Link
            to="/contact"
            className="inline-block mt-8 px-8 py-4 bg-[#1C1814] text-[#F5EFE4] text-[11px] tracking-[0.25em] uppercase hover:bg-[#C09A3C] transition-colors duration-300"
          >
            Contactez-moi pour plus d'informations
          </Link>
        </section>

        <p className="text-[11px] text-[#1C1814]/40 font-light italic border-t pt-6 mt-16 border-[#C09A3C]/15">
          Déplacement inclus dans les 15 premiers kilomètres · Au-delà : 0,50 € par kilomètre supplémentaire
        </p>
      </div>
    </div>
  );
}