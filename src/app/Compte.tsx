import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Tab = "profil" | "historique" | "credits" | "planning";

export function ComptePage() {
  const { user, logout, useCredits, addBooking } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedService, setSelectedService] = useState("Cours particulier");

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

  const handleBooking = () => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const success = useCredits(1);
    if (!success) {
      alert("Crédits insuffisants. Veuillez acheter des séances.");
      return;
    }
    addBooking({ date: dateStr, time: selectedTime, service: selectedService, usedCredits: 1 });
    alert("Créneau réservé !");
  };

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
              onClick={() => setActiveTab(tab.id as Tab)}
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
                  <Calendar onChange={(date) => setSelectedDate(date as Date)} value={selectedDate} minDate={new Date()} className="border-0 shadow-sm" />
                </div>
                <div>
                  <div className="mb-4">
                    <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40">Horaire</label>
                    <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full border-b border-[#1C1814]/15 py-2 text-[14px] outline-none focus:border-[#C09A3C] transition-colors">
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40">Service</label>
                    <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full border-b border-[#1C1814]/15 py-2 text-[14px] outline-none focus:border-[#C09A3C] transition-colors">
                      <option>Cours particulier</option>
                      <option>Cours collectif</option>
                      <option>Travail du cheval</option>
                      <option>Rééducation</option>
                      <option>Éducation équine</option>
                    </select>
                  </div>
                  <button onClick={handleBooking} className="w-full py-3 bg-[#C09A3C] text-white text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors">Réserver (1 crédit)</button>
                  <p className="text-[11px] text-[#1C1814]/40 mt-2">Il vous reste {user.credits} crédits</p>
                </div>
              </div>
              {user.bookings.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Mes réservations</h3>
                  <div className="space-y-2">
                    {user.bookings.map((b) => <div key={b.id} className="text-[13px] text-[#1C1814]/60">{new Date(b.date).toLocaleDateString()} à {b.time} · {b.service}</div>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}