import { useCart } from "../components/CartContext";

const heroImg =
  "/images/travail-cheval/travail-cheval.jpg";

// Nouveaux tarifs
const items = [
  { label: "Travail du cheval 1h (préparation comprise)", price: 50 },
  { label: "Carte 5 séances travail 1h (préparation comprise)", price: 240 },
  { label: "Carte 10 séances travail 1h (préparation comprise)", price: 460 },
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
          <h2
            className="text-3xl md:text-4xl font-normal text-[#C09A3C] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Travail du cheval
          </h2>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-8 max-w-2xl">
            Je propose le travail régulier de votre cheval, monté ou à pied, en fonction de vos objectifs et de ses besoins spécifiques. Le travail est construit autour du développement physique, mental et biomécanique du cheval afin d'améliorer sa locomotion, son équilibre, sa disponibilité et sa compréhension des aides.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-between p-6 bg-[#EDE4D0] rounded-sm hover:bg-[#E8DDD0] transition-colors text-center"
              >
                <span className="text-[14px] text-[#1C1814] font-light mb-3">{item.label}</span>
                <div className="flex flex-col items-center gap-3 w-full">
                  <span className="text-[20px] font-medium text-[#C09A3C]">{item.price} €</span>
                  <button
                    onClick={() => addItem(item.label, item.price, "travail")}
                    className="w-full px-4 py-2 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors"
                  >
                    Ajouter au panier
                  </button>
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