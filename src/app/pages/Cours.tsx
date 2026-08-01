import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useState } from "react";

const heroImg =
  "/images/cours collectifs/cours collectifs.png";

// Nouveaux tarifs cours particuliers (uniquement 1h)
const coursParticuliers = [
  { label: "Cours 1h", price: 65 },
  { label: "Carte 5 séances cours 1h", price: 315 },
  { label: "Carte 10 séances cours 1h", price: 590 },
];

// Nouveaux tarifs cours collectifs avec paliers
const coursCollectifs = [
  { label: "2-3 cavaliers", price: 35, maxCavaliers: 3 },
  { label: "4-6 cavaliers", price: 30, maxCavaliers: 6 },
  { label: "7-10 cavaliers", price: 25, maxCavaliers: 10 },
];

export function CoursPage() {
  const { addItem } = useCart();
  const [selectedGroup, setSelectedGroup] = useState(coursCollectifs[0]);

  // Fonction pour ajouter au panier avec le bon prix
  const handleAddToCart = () => {
    const label = `Cours collectif (${selectedGroup.label}) - ${selectedGroup.price}€/pers`;
    addItem(label, selectedGroup.price, "cours");
  };

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
            className="text-3xl md:text-4xl font-normal text-[#C09A3C] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Cours particuliers
          </h2>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-2 max-w-2xl">
            Des séances individuelles adaptées à vos objectifs, du loisir à la compétition. Travail monté, à pied, technique, légèreté ou résolution de difficultés spécifiques.
          </p>
          <p className="text-[13px] text-[#C09A3C] font-light italic mb-8">
            Carte valable 1 an à partir de la date d'achat
          </p>
          <TarifList items={coursParticuliers} addItem={addItem} serviceType="cours" />
        </section>

        {/* Cours collectifs */}
        <section>
          <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-3">
            Cours collectifs
          </p>
          <h2
            className="text-3xl md:text-4xl font-normal text-[#C09A3C] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Cours collectifs
          </h2>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-8 max-w-2xl">
            Monitrice indépendante, je me déplace dans votre écurie pour assurer des cours collectifs adaptés au niveau et aux objectifs de chacun. Réunissez votre groupe, et contactez-moi pour organiser un cours collectif sur votre structure.
          </p>

          {/* Dropdown pour sélectionner le nombre de cavaliers */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
            <div className="flex flex-col">
              <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40 mb-1">
                Nombre de cavaliers
              </label>
              <select
                value={selectedGroup.label}
                onChange={(e) => {
                  const group = coursCollectifs.find(g => g.label === e.target.value);
                  if (group) setSelectedGroup(group);
                }}
                className="px-4 py-2 bg-[#EDE4D0] rounded-sm text-[14px] text-[#1C1814] outline-none focus:border-[#C09A3C] border border-transparent focus:border-[#C09A3C] transition-colors min-w-[200px]"
              >
                {coursCollectifs.map((group) => (
                  <option key={group.label} value={group.label}>
                    {group.label} - {group.price}€/personne
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddToCart}
              className="px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors whitespace-nowrap"
            >
              Ajouter au panier ({selectedGroup.price}€/pers)
            </button>
          </div>

          {/* Affichage des tarifs en grille */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {coursCollectifs.map((group) => (
              <div
                key={group.label}
                className={`p-4 bg-[#EDE4D0] rounded-sm text-center transition-colors ${
                  selectedGroup.label === group.label ? "ring-2 ring-[#C09A3C]" : ""
                }`}
              >
                <span className="text-[14px] text-[#1C1814] font-light block">{group.label}</span>
                <span className="text-[18px] font-medium text-[#C09A3C]">{group.price}€/personne</span>
              </div>
            ))}
          </div>
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
              onClick={() => addItem(item.label, item.price, serviceType)}
              className="w-full px-4 py-2 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}