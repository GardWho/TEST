import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { ArrowRight } from "lucide-react";

const heroImg =
  "https://images.unsplash.com/photo-1600715151005-e6d44b9ef840?w=1400&h=900&fit=crop&auto=format&q=85";

const coursParticuliers = [
  { label: "5 séances de 30 min (préparation comprise)", price: 170 },
  { label: "5 séances de 1h (préparation comprise)", price: 300 },
  { label: "10 séances de 30 min (préparation comprise)", price: 320 },
  { label: "10 séances de 1h (préparation comprise)", price: 580 },
  { label: "Séance 30 min", price: 35 },
];

const coursCollectifs = [
  { label: "2-3 cavaliers", price: 30 },
  { label: "4-6 cavaliers", price: 25 },
  { label: "7-10 cavaliers", price: 20 },
];

export function CoursPage() {
  const { addItem } = useCart();

  return (
    <div className="bg-[#F5EFE4] min-h-screen">
      {/* HERO */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden bg-[#2A2318]">
        <img
          src={heroImg}
          alt="Cours d'équitation"
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
            Cours
          </h1>
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-14 py-16 space-y-16">
        {/* Cours particuliers */}
        <section>
          <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-3">
            Cours particuliers
          </p>
          <h2
            className="text-3xl md:text-4xl font-normal text-[#1C1814] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Cours particuliers
          </h2>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-8 max-w-2xl">
            Des séances individuelles adaptées à vos objectifs, du loisir à la compétition. Travail monté, à pied, technique, légèreté ou résolution de difficultés spécifiques.
          </p>
          <TarifList items={coursParticuliers} addItem={addItem} serviceType="cours" />
        </section>

        {/* Cours collectifs */}
        <section>
          <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-3">
            Cours collectifs
          </p>
          <h2
            className="text-3xl md:text-4xl font-normal text-[#1C1814] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Cours collectifs
          </h2>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-8 max-w-2xl">
            Monitrice indépendante, je me déplace dans votre écurie ou sur votre structure pour assurer des cours collectifs adaptés au niveau et aux objectifs de chaque cavalier. Les séances sont personnalisées selon les besoins du groupe : travail sur le plat, obstacle, équitation éthologique, travail à pied, préparation aux examens fédéraux ou perfectionnement technique. Réunissez votre groupe, et contactez-moi pour organiser un cours collectif sur votre structure.
          </p>
          <TarifList items={coursCollectifs} addItem={addItem} serviceType="cours" />
        </section>

        <p className="text-[11px] text-[#1C1814]/40 font-light italic border-t pt-6 border-[#C09A3C]/15">
          Déplacement inclus dans les 15 premiers kilomètres · Au-delà : 0,35 € par kilomètre (calcul automatique dans le panier)
        </p>
      </div>
    </div>
  );
}

function TarifList({
  items,
  addItem,
  serviceType,
}: {
  items: { label: string; price: number }[];
  addItem: (label: string, price: number, serviceType: "cours" | "travail" | "reeducation" | "education") => void;
  serviceType: "cours" | "travail" | "reeducation" | "education";
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between p-4 bg-[#EDE4D0] rounded-sm hover:bg-[#E8DDD0] transition-colors"
        >
          <span className="text-[14px] text-[#1C1814] font-light">{item.label}</span>
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-medium text-[#C09A3C]">{item.price} €</span>
            <button
              onClick={() => addItem(item.label, item.price, serviceType)}
              className="px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}