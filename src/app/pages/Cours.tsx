import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useState } from "react";

const heroImg = "/images/cours-collectifs/cours-collectifs.png";
const coursPartImg = "/images/cours-part/cours-part.jpg";
const bannerImg = "/images/cours-collectifs/cours-collectifs2.JPG";

const coursParticuliers = [
  { label: "Cours 1h", price: 65 },
  { label: "Carte 5 séances cours 1h", price: 315 },
  { label: "Carte 10 séances cours 1h", price: 590 },
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
      {/* HERO */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden bg-[#2A2318]">
        <img src={heroImg} alt="Cours d'équitation" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "sepia(18%) saturate(0.9)", opacity: 0.6 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814]/70 via-transparent to-[#1C1814]/30" />
        <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-20 pb-10">
          <p className="text-[9px] tracking-[0.48em] uppercase mb-3" style={{ color: "#C09A3C" }}>Prestations</p>
          <h1 className="font-normal leading-[1.0] text-[#F5EFE4]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 56px)" }}>Cours</h1>
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-14 py-16 space-y-16">

        {/* ── COURS PARTICULIERS ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-4xl font-normal text-[#1C1814] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Cours particuliers</h2>
            <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-2">Des séances adaptées à votre niveau, à votre cheval et à vos objectifs, du loisir à la compétition. Travail monté ou à pied, technique, légèreté et résolution de difficultés spécifiques.</p>
            <p className="text-[13px] text-[#C09A3C] font-light italic mb-6">Cartes valables 1 an à partir de la date d'achat.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 items-stretch">
              {coursParticuliers.map((item) => (
                <div key={item.label} className="bg-[#EDE4D0] p-4 rounded-sm hover:bg-[#E8DDD0] transition-colors text-center flex flex-col">
                  <h3 className="text-sm font-normal text-[#1C1814] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{item.label}</h3>
                  <p className="text-2xl font-medium text-[#C09A3C] mb-3">{item.price} €</p>
                  <button onClick={() => addItem(item.label, item.price, "cours")} className="w-full py-2 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors mt-auto">
                    RÉSERVER
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image à droite (pleine hauteur) */}
          <div className="relative h-full min-h-[400px] lg:min-h-0 overflow-hidden rounded-sm bg-[#D4C9B8]">
            <img src={coursPartImg} alt="Cours particuliers" className="w-full h-full object-cover" style={{ filter: "sepia(12%)" }} />
          </div>
        </section>

        {/* ── COURS COLLECTIFS ── */}
        <section>
          <h2 className="text-3xl md:text-4xl font-normal text-[#1C1814] mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Cours collectifs</h2>
          <p className="text-[15px] text-[#1C1814]/60 leading-relaxed font-light mb-8 max-w-2xl mx-auto text-center">Monitrice indépendante, je me déplace dans votre écurie pour assurer des cours collectifs adaptés au niveau et aux objectifs de chacun. Réunissez votre groupe, et contactez-moi pour organiser un cours collectif sur votre structure.</p>

          {/* Gauche : Paliers | Droite : Sélecteur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Gauche : 3 paliers */}
            <div className="space-y-3">
              {paliers.map((palier) => (
                <div key={palier.label} className="bg-[#EDE4D0] p-4 rounded-sm text-center hover:bg-[#E8DDD0] transition-colors">
                  <span className="text-[14px] text-[#1C1814] font-light block">{palier.label}</span>
                  <span className="text-[18px] font-medium text-[#C09A3C]">{palier.price}€/personne</span>
                </div>
              ))}
            </div>

            {/* Droite : Sélecteur */}
            <div className="bg-[#EDE4D0] p-6 rounded-sm">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#1C1814]/60 mb-3 text-center">Nombre de cavaliers</p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => adjustCount(-1)} disabled={cavalierCount <= 1} className="w-7 h-7 rounded-full bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm">-</button>
                <span className="text-xl font-medium text-[#1C1814] w-6 text-center">{cavalierCount}</span>
                <button onClick={() => adjustCount(1)} disabled={cavalierCount >= 10} className="w-7 h-7 rounded-full bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm">+</button>
                <span className="text-[13px] font-medium text-[#C09A3C] ml-2">{currentPrice}€ / pers</span>
              </div>
              <button onClick={handleAddToCart} className="w-full mt-4 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors">
                Ajouter au panier ({currentPrice}€/pers × {cavalierCount} pers)
              </button>
            </div>
          </div>
        </section>

        {/* ── BANNIÈRE IMAGE (pleine largeur) ── */}
        <div className="relative h-[200px] md:h-[300px] overflow-hidden rounded-sm bg-[#D4C9B8] w-full">
          <img src={bannerImg} alt="Bannière" className="w-full h-full object-cover" style={{ filter: "sepia(12%)" }} />
        </div>

        {/* ── EXAMENS FÉDÉRAUX + VISIO ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#C09A3C]/15">
          <div className="bg-[#EDE4D0] p-8 rounded-sm hover:bg-[#E8DDD0] transition-colors">
            <h3 className="text-2xl font-normal text-[#1C1814] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Examens fédéraux</h3>
            <p className="text-[14px] text-[#1C1814]/60 leading-relaxed font-light">Préparation et accompagnement aux passages des examens fédéraux : Galops 1 à 7 et Savoirs d'équitation éthologique 1 à 5, selon votre niveau et vos objectifs.</p>
            <Link to="/contact" className="inline-block mt-4 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors">Me contacter</Link>
          </div>
          <div className="bg-[#EDE4D0] p-8 rounded-sm hover:bg-[#E8DDD0] transition-colors">
            <h3 className="text-2xl font-normal text-[#1C1814] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Cours en visio</h3>
            <p className="text-[14px] text-[#1C1814]/60 leading-relaxed font-light">Des séances à distance peuvent être organisées sur demande pour l'analyse, le suivi, la préparation théorique ou une difficulté précise.</p>
            <Link to="/contact" className="inline-block mt-4 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase bg-[#C09A3C] text-white hover:bg-[#1C1814] transition-colors">Me contacter</Link>
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