import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useState } from "react";

const heroImg = "/images/bannières/banniere-01.webp";
const coursPartImg = "/images/cours-part/cours-part.jpg";
const bannerImg = "/images/cours-collectifs/cours-collectifs.png";

const coursParticuliers = [
  { label: "Cours 1h", price: 65 },
  { label: "Carte 5 séances (1h)", price: 315 },
  { label: "Carte 10 séances (1h)", price: 590 },
];

const getPriceByCavaliers = (count: number): number => {
  if (count <= 3) return 35;
  if (count <= 6) return 30;
  return 25;
};

export function CoursPage() {
  const { addItem } = useCart();
  const [cavalierCount, setCavalierCount] = useState(1);

  const handleAddToCart = () => {
    const price = getPriceByCavaliers(cavalierCount);
    const label = `Cours collectif (${cavalierCount} cavalier${cavalierCount > 1 ? 's' : ''}) - ${price}€/pers`;
    addItem(label, price, "cours");
  };

  const adjustCount = (delta: number) => {
    const newCount = cavalierCount + delta;
    if (newCount >= 1 && newCount <= 10) {
      setCavalierCount(newCount);
    }
  };

  const currentPrice = getPriceByCavaliers(cavalierCount);

  const paliers = [
    { label: "2-3 cavaliers", price: 35 },
    { label: "4-6 cavaliers", price: 30 },
    { label: "7-10 cavaliers", price: 25 },
  ];

  return (
    <div className="bg-[#F5EFE4] min-h-screen">
      {/* ─── HERO ─── */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden bg-[#2A2318]">
        <img src={heroImg} alt="Cours d'équitation" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "sepia(18%) saturate(0.9)", opacity: 0.6 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814]/70 via-transparent to-[#1C1814]/30" />
        <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-20 pb-10">
          <p className="text-[9px] tracking-[0.48em] uppercase mb-3" style={{ color: "#C09A3C" }}>Prestations</p>
          <h1 className="font-normal leading-[1.0] text-[#F5EFE4]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 56px)" }}>Cours</h1>
        </div>
      </div>

      {/* ─── CONTENU (section limitée) ─── */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-14 py-12 space-y-12">

        {/* ============================================================ */}
        {/* SECTION : COURS PARTICULIERS (RÉDUITE) */}
        {/* ============================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Gauche : texte + cartes */}
          <div>
            <h2 className="text-2xl md:text-3xl font-normal text-[#1C1814] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Cours particuliers
            </h2>
            <p className="text-[14px] text-[#1C1814]/60 leading-relaxed font-light mb-1">
              Des séances adaptées à votre niveau, à votre cheval et à vos objectifs, du loisir à la compétition.
            </p>
            <p className="text-[12px] text-[#C09A3C] font-light italic mb-4">
              Cartes valables 1 an à partir de la date d'achat.
            </p>

            {/* ✅ CARTES PLUS PETITES (h-140px) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {coursParticuliers.map((item) => (
                <div
                  key={item.label}
                  className="bg-[#EDE4D0] p-3 rounded-sm hover:bg-[#E8DDD0] transition-colors text-center flex flex-col h-[140px]"
                >
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-xs font-normal text-[#1C1814] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.label}
                    </h3>
                    <p className="text-xl font-medium text-[#C09A3C] mb-2">{item.price} €</p>
                  </div>
                  <button
                    onClick={() => addItem(item.label, item.price, "cours")}
                    className="w-full py-1.5 text-[9px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors mt-auto"
                  >
                    RÉSERVER
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Droite : image (plus petite) */}
          <div className="relative h-[280px] lg:h-[350px] overflow-hidden rounded-sm bg-[#D4C9B8]">
            <img
              src={coursPartImg}
              alt="Cours particuliers"
              className="w-full h-full object-cover"
              style={{ filter: "sepia(12%)" }}
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION : COURS COLLECTIFS (centré) */}
        {/* ============================================================ */}
        <section>
          <h2 className="text-2xl md:text-3xl font-normal text-[#1C1814] mb-3 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Cours collectifs
          </h2>
          <p className="text-[14px] text-[#1C1814]/60 leading-relaxed font-light mb-6 max-w-2xl mx-auto text-center">
            Monitrice indépendante, je me déplace dans votre écurie pour assurer des cours collectifs adaptés au niveau et aux objectifs de chacun. Réunissez votre groupe, et contactez-moi pour organiser un cours collectif sur votre structure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Gauche : 3 paliers */}
            <div className="space-y-3 flex flex-col justify-center">
              {paliers.map((palier) => (
                <div key={palier.label} className="bg-[#EDE4D0] p-3 rounded-sm text-center hover:bg-[#E8DDD0] transition-colors">
                  <span className="text-[13px] text-[#1C1814] font-light block">{palier.label}</span>
                  <span className="text-[17px] font-medium text-[#C09A3C]">{palier.price}€/personne</span>
                </div>
              ))}
            </div>

            {/* Droite : Sélecteur (centré verticalement) */}
            <div className="bg-[#EDE4D0] p-5 rounded-sm flex flex-col items-center justify-center h-full">
              <p className="text-[8px] tracking-[0.3em] uppercase text-[#1C1814]/60 mb-2">
                Nombre de cavaliers
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => adjustCount(-1)}
                  disabled={cavalierCount <= 1}
                  className="w-6 h-6 rounded-full bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="text-lg font-medium text-[#1C1814] w-5 text-center">
                  {cavalierCount}
                </span>
                <button
                  onClick={() => adjustCount(1)}
                  disabled={cavalierCount >= 10}
                  className="w-6 h-6 rounded-full bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs"
                >
                  +
                </button>
                <span className="text-[12px] font-medium text-[#C09A3C] ml-1">
                  {currentPrice}€ / pers
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full mt-3 px-4 py-2 text-[9px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors"
              >
                Ajouter au panier ({currentPrice}€/pers × {cavalierCount} pers)
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ─── BANNIÈRE IMAGE (PLEINE LARGEUR) ─── */}
      <div className="relative h-[200px] md:h-[300px] overflow-hidden bg-[#D4C9B8] w-full">
        <img
          src={bannerImg}
          alt="Bannière"
          className="w-full h-full object-cover"
          style={{ filter: "sepia(12%)" }}
        />
      </div>

      {/* ─── SUITE DU CONTENU (limitée) ─── */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-14 py-12 space-y-12">

        {/* ── EXAMENS FÉDÉRAUX + VISIO ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#C09A3C]/15">
          <div className="bg-[#EDE4D0] p-6 rounded-sm hover:bg-[#E8DDD0] transition-colors">
            <h3 className="text-xl font-normal text-[#1C1814] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Examens fédéraux</h3>
            <p className="text-[13px] text-[#1C1814]/60 leading-relaxed font-light">Préparation et accompagnement aux passages des examens fédéraux : Galops 1 à 7 et Savoirs d'équitation éthologique 1 à 5, selon votre niveau et vos objectifs.</p>
            <Link to="/contact" className="inline-block mt-3 px-5 py-2 text-[9px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors">Me contacter</Link>
          </div>
          <div className="bg-[#EDE4D0] p-6 rounded-sm hover:bg-[#E8DDD0] transition-colors">
            <h3 className="text-xl font-normal text-[#1C1814] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Cours en visio</h3>
            <p className="text-[13px] text-[#1C1814]/60 leading-relaxed font-light">Des séances à distance peuvent être organisées sur demande pour l'analyse, le suivi, la préparation théorique ou une difficulté précise.</p>
            <Link to="/contact" className="inline-block mt-3 px-5 py-2 text-[9px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors">Me contacter</Link>
          </div>
        </div>

        {/* ─── DÉPLACEMENT ─── */}
        <p className="text-[11px] text-[#1C1814]/40 font-light italic border-t pt-6 border-[#C09A3C]/15">
          Déplacement inclus dans les 15 premiers kilomètres · Au-delà : 0,50 € par kilomètre (calcul automatique dans le panier)
        </p>

      </div>
    </div>
  );
}