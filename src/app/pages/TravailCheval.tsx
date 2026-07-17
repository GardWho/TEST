import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";

const heroImg =
  "https://images.unsplash.com/photo-1777133025718-ca8a34cdcd7d?w=1200&h=1600&fit=crop&auto=format&q=85";

const items = [
  { label: "Séance de travail à pied (1h)", price: 45 },
  { label: "Pack 5 séances travail à pied", price: 210 },
  { label: "Séance de manipulation / confiance", price: 35 },
  { label: "Bilan comportemental complet", price: 0 },
];

export function TravailChevalPage() {
  const { addItem } = useCart();

  return (
    <div className="bg-[#F5EFE4] min-h-screen">
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden bg-[#2A2318]">
        <img
          src={heroImg}
          alt="Travail du cheval"
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
            Travail du cheval
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-14 py-16">
        <section>
          <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-3">
            Travail du cheval
          </p>
          <h2
            className="text-3xl md:text-4xl font-normal text-[#1C1814] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Travail du cheval
          </h2>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-8 max-w-2xl">
            Un travail centré sur le cheval et ses capacités — qu'il s'agisse d'un jeune cheval à éduquer, d'un cheval en difficulté comportementale ou d'une rééducation post-traumatisme. Mon intervention se fait avec patience et méthode, en respectant le rythme de chaque animal.
          </p>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-8 max-w-2xl">
            Je propose des séances de travail à pied, de manipulation, de remise en confiance, et de préparation à la monte. L'objectif est de bâtir des fondations solides pour une relation durable et harmonieuse.
          </p>

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
                      onClick={() => addItem(item.label, item.price, "travail")}
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