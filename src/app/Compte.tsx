import { useState } from "react";
import { useAuth } from "../AuthContext";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

type Tab = "profil" | "historique" | "credits" | "planning";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

export function ComptePage() {
  const { user, logout, useCredits } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedService, setSelectedService] = useState("Cours particulier");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4]">
        <div className="text-center">
          <p className="text-[15px] text-[#1C1814]/60">Veuillez vous connecter</p>
          <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-[#C09A3C] text-white text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const fetchBookings = async () => {
    const { data } = await supabase.from("bookings").select("*").eq("user_id", user.id);
    setBookings(data || []);
  };

  // Charger les réservations quand on ouvre l'onglet planning
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "planning") fetchBookings();
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      alert("Veuillez sélectionner une date.");
      return;
    }
    const { data: existing } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", selectedDate)
      .eq("time", selectedTime)
      .maybeSingle();
    if (existing) {
      alert("Ce créneau est déjà réservé.");
      return;
    }
    const success = await useCredits(1);
    if (!success) {
      alert("Crédits insuffisants. Veuillez acheter des séances.");
      return;
    }
    const { error: insertError } = await supabase.from("bookings").insert({
      user_id: user.id,
      date: selectedDate,
      time: selectedTime,
      service: selectedService,
    });
    if (insertError) {
      alert("Erreur lors de la réservation.");
      return;
    }
    alert("Créneau réservé !");
    fetchBookings();
  };

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(b => b.date >= today);
  const past = bookings.filter(b => b.date < today);

  return (
    <div className="min-h-screen bg-[#F5EFE4] pt-20 px-8 md:px-14">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-normal mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Mon compte</h1>
        <p className="text-[14px] text-[#1C1814]/60 mb-8">Bonjour {user.name} · {user.credits} crédits disponibles</p>

        <div className="flex gap-6 border-b border-[#C09A3C]/15 mb-8">
          {[
            { id: "profil", label: "Profil" },
            { id: "historique", label: "Historique" },
            { id: "credits", label: "Crédits" },
            { id: "planning", label: "Planning" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as Tab)}
              className={`pb-3 text-[11px] tracking-[0.25em] uppercase transition-colors ${
                activeTab === tab.id ? "text-[#C09A3C] border-b-2 border-[#C09A3C]" : "text-[#1C1814]/40 hover:text-[#1C1814]/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 rounded-sm shadow-sm">
          {activeTab === "profil" && (
            <div>
              <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Mes informations</h2>
              <p><strong>Nom :</strong> {user.name}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Crédits :</strong> {user.credits} séances</p>
              <button onClick={logout} className="mt-6 px-6 py-2 bg-red-500 text-white text-[11px] tracking-[0.25em] uppercase hover:bg-red-600 transition-colors">Se déconnecter</button>
            </div>
          )}

          {activeTab === "historique" && (
            <div>
              <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Historique des achats</h2>
              {user.purchases.length === 0 ? <p className="text-[#1C1814]/40">Aucun achat pour le moment.</p> : (
                <div className="space-y-4">
                  {user.purchases.map((p) => (
                    <div key={p.id} className="border-b border-[#C09A3C]/15 pb-4">
                      <p className="text-[12px] text-[#1C1814]/40">{new Date(p.date).toLocaleDateString()}</p>
                      <p><strong>Total :</strong> {p.total} €</p>
                      <p><strong>Articles :</strong> {p.items.map(i => i.label).join(", ")}</p>
                      <p><strong>Statut :</strong> {p.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "credits" && (
            <div>
              <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Mes crédits</h2>
              <p className="text-[15px] mb-4">Vous avez <strong>{user.credits}</strong> séances créditées.</p>
              <p className="text-[13px] text-[#1C1814]/60">Chaque achat de cours vous crédite d'autant de séances.</p>
              <Link to="/prestations" className="inline-block mt-4 px-6 py-2 bg-[#C09A3C] text-white text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors">Acheter des séances</Link>
            </div>
          )}

          {activeTab === "planning" && (
            <div>
              <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Réserver un créneau</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40 block mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-[#C09A3C]/20 rounded-sm px-4 py-2 text-[14px] outline-none focus:border-[#C09A3C] transition-colors bg-[#F8F3EC]"
                  />
                </div>
                <div>
                  <div className="mb-4">
                    <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40">Horaire</label>
                    <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full border-b border-[#C09A3C]/15 py-2 text-[14px] outline-none focus:border-[#C09A3C] transition-colors">
                      {HOURS.map((h) => {
                        const time = `${h.toString().padStart(2, "0")}:00`;
                        return <option key={time} value={time}>{time}</option>;
                      })}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40">Service</label>
                    <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full border-b border-[#C09A3C]/15 py-2 text-[14px] outline-none focus:border-[#C09A3C] transition-colors">
                      <option>Cours particulier</option>
                      <option>Cours collectif</option>
                      <option>Travail du cheval</option>
                      <option>Rééducation</option>
                      <option>Éducation équine</option>
                    </select>
                  </div>
                  <button
                    onClick={handleBooking}
                    className="w-full py-3 bg-[#C09A3C] text-white text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors"
                  >
                    Réserver (1 crédit)
                  </button>
                  <p className="text-[11px] text-[#1C1814]/40 mt-2">Il vous reste {user.credits} crédits</p>
                  {error && <p className="text-red-500 text-[12px] mt-2">{error}</p>}
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-normal mb-4">Mes réservations</h3>
                <h4 className="text-sm font-medium mb-2 text-[#C09A3C]">À venir</h4>
                <ul className="space-y-2">
                  {upcoming.length === 0 && <li className="text-sm text-gray-500">Aucune réservation à venir.</li>}
                  {upcoming.map((b) => (
                    <li key={b.id} className="text-[13px] text-[#1C1814]/60 flex justify-between">
                      <span>{b.date} à {b.time} · {b.service}</span>
                      <button
                        onClick={async () => {
                          await supabase.from("bookings").delete().eq("id", b.id);
                          fetchBookings();
                        }}
                        className="text-red-500 text-xs"
                      >
                        Annuler
                      </button>
                    </li>
                  ))}
                </ul>
                <h4 className="text-sm font-medium mb-2 mt-4 text-[#C09A3C]">Passées</h4>
                <ul className="space-y-2">
                  {past.length === 0 && <li className="text-sm text-gray-500">Aucune réservation passée.</li>}
                  {past.map((b) => (
                    <li key={b.id} className="text-[13px] text-[#1C1814]/60">
                      {b.date} à {b.time} · {b.service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}