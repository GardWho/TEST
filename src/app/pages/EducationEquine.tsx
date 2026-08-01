import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";

const heroImg =
  "/images/débourage education/débourageeducation2.jpg";

const items = [
  { label: "Débourrage complet (30 jours)", price: 0 },
  { label: "Séance d'éducation (1h)", price: 50 },
  { label: "Pack 10 séances éducation", price: 460 },
  { label: "Suivi éducatif à domicile", price: 0 },
];

export function EducationEquinePage() {
  const { addItem } = useCart();

  return (
    <div className="bg-[#F5EFE4] min-h-screen">
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden bg-[#2A2318]">
        <img
          src={heroImg}
          alt="Éducation équine"
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
            Éducation équine
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-14 py-16">
        <section>
          <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-3">
            Éducation équine
          </p>
          <h2
            className="text-3xl md:text-4xl font-normal text-[#C09A3C] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Débourrage & éducation
          </h2>
          <div className="space-y-4 text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-8 max-w-2xl">
            <p>
              Le débourrage est une étape essentielle dans la vie du cheval. Il constitue la base de sa future relation avec l'humain, de sa confiance et de son équilibre mental comme physique.
            </p>
            <p>
              Mon approche repose sur une mise en confiance progressive du jeune cheval, dans le respect de son rythme, de sa compréhension et de ses capacités. L'objectif est de former un cheval serein, attentif et disponible, prêt à évoluer dans le calme et la compréhension.
            </p>
          </div>

          {/* Lien vers contact avec devis */}
          <Link
            to="/contact"
            className="inline-block mb-8 px-6 py-3 bg-[#C09A3C] text-white text-[13px] font-medium hover:bg-[#1C1814] transition-colors"
          >
            À partir de 800€ - Demandez un devis
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-4 bg-[#EDE4D0] rounded-sm hover:bg-[#E8DDD0] transition-colors"
              >
                <span className="text-[14px] text-[#1C1814] font-light">{item.label}</span>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-medium text-[#C09A3C]">
                    {item.price === 0 ? "Devis" : `${item.price} €`}
                  </span>
                  {item.price === 0 ? (
                    <Link
                      to="/contact"
                      className="px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase bg-[#1C1814] text-white hover:bg-[#C09A3C] transition-colors"
                    >
                      Nous contacter
                    </Link>
                  ) : (
                    <button
                      onClick={() => addItem(item.label, item.price, "education")}
                      className="px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors"
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="text-[11px] text-[#1C1814]/40 font-light italic border-t pt-6 mt-12 border-[#C09A3C]/15">
          Déplacement inclus dans les 15 premiers kilomètres · Au-delà : 0,35 € par kilomètre
        </p>
      </div>
    </div>
  );
}