import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

type Tab = "profil" | "historique" | "credits" | "planning";

// Génération des créneaux de 7h00 à 19h00 toutes les 15 minutes
const times: string[] = [];
for (let h = 7; h <= 18; h++) {
  for (let m = 0; m < 60; m += 15) {
    times.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  }
}
times.push("19:00");

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

// Alignement lundi = 0
const getFirstDayOfMonth = (year: number, month: number) =>
  (new Date(year, month, 1).getDay() + 6) % 7;

export function ComptePage() {
  const { user, logout, bookSlot, cancelBooking, refreshProfile, session } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("Cours particulier");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "planning") fetchBookings();
  }, [user, activeTab]);

  // Récupère toutes les réservations via le serveur
  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Erreur lors du chargement des réservations.");
        return;
      }
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les réservations.");
    }
  };

  // Vérification côté client (le serveur revérifie toujours)
  const isAtLeast24hAhead = (date: string, time: string) => {
    const bookingDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    return bookingDateTime.getTime() - now.getTime() >= 24 * 60 * 60 * 1000;
  };

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

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Veuillez sélectionner une date et un horaire.");
      return;
    }
    if (!isAtLeast24hAhead(selectedDate, selectedTime)) {
      alert("Impossible de réserver à moins de 24h du créneau.");
      return;
    }

    setSubmitting(true);
    const result = await bookSlot({ date: selectedDate, time: selectedTime, service: selectedService });
    setSubmitting(false);

    if (!result.success) {
      alert(result.error || "Une erreur est survenue.");
      return;
    }

    await refreshProfile();
    await fetchBookings();
    alert("Créneau réservé !");
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleCancel = async (bookingId: string) => {
    const result = await cancelBooking(bookingId);
    if (!result.success) {
      alert(result.error || "Erreur lors de l'annulation.");
      return;
    }
    await refreshProfile();
    await fetchBookings();
  };

  const today = new Date().toISOString().split("T")[0];
  const filteredBookings = bookings.filter((b) => {
    if (filter === "upcoming") return b.date >= today;
    if (filter === "past") return b.date < today;
    return true;
  });

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const daysArray: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formatDate = (day: number) => {
    const month = (currentMonth + 1).toString().padStart(2, "0");
    const year = currentYear;
    const dayStr = day.toString().padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const bookingsByDay = bookings.reduce((acc, b) => {
    acc[b.date] = (acc[b.date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const selectedDateBookings = selectedDate
    ? bookings.filter((b) => b.date === selectedDate)
    : [];

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
              onClick={() => { setActiveTab(tab.id as Tab); if (tab.id === "planning") fetchBookings(); }}
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendrier */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => {
                        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
                        else setCurrentMonth(currentMonth - 1);
                      }}
                      className="px-3 py-1 bg-[#C09A3C] text-white text-sm rounded"
                    >←</button>
                    <h2 className="text-lg font-normal">
                      {new Date(currentYear, currentMonth, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </h2>
                    <button
                      onClick={() => {
                        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
                        else setCurrentMonth(currentMonth + 1);
                      }}
                      className="px-3 py-1 bg-[#C09A3C] text-white text-sm rounded"
                    >→</button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                      <div key={i} className="text-center text-[10px] uppercase text-[#1C1814]/40">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {daysArray.map((day, index) => {
                      if (day === null) return <div key={index} />;
                      const dateStr = formatDate(day);
                      const count = bookingsByDay[dateStr] || 0;
                      const isToday = dateStr === today;
                      return (
                        <button
                          key={index}
                          onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                          className={`h-10 rounded-sm text-sm flex flex-col items-center justify-center relative ${
                            isToday ? "bg-[#C09A3C]/10" : ""
                          } ${count > 0 ? "bg-[#C09A3C]/20" : "bg-[#F8F3EC]"}`}
                        >
                          <span className={selectedDate === dateStr ? "text-[#C09A3C] font-bold" : ""}>{day}</span>
                          {count > 0 && <span className="text-[8px] text-[#C09A3C] mt-0.5">{count} résa</span>}
                        </button>
                      );
                    })}
                  </div>

                  {selectedDate && selectedDateBookings.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2 text-[#C09A3C]">Réservations ce jour</h3>
                      <ul className="space-y-2">
                        {selectedDateBookings.map((b) => (
                          <li key={b.id} className="bg-[#F8F3EC] p-2 rounded-sm flex justify-between text-sm">
                            <span>{b.time} - {b.service}</span>
                            {b.user_id === user.id && (
                              <button onClick={() => handleCancel(b.id)} className="text-red-500 text-xs">Annuler</button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Formulaire + historique */}
                <div>
                  <h2 className="text-xl font-normal mb-4">Réserver un créneau</h2>
                  {!selectedDate ? (
                    <p className="text-sm text-gray-500">Sélectionnez une date dans le calendrier.</p>
                  ) : (
                    <>
                      <p className="text-sm mb-4">Date : <strong>{new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong></p>
                      <label className="block mb-2 text-sm">Horaire</label>
                      <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full border p-2 mb-4">
                        <option value="">-- Choisir --</option>
                        {times.map((time) => {
                          const isTaken = bookings.some((b) => b.date === selectedDate && b.time === time);
                          const isPast = !isAtLeast24hAhead(selectedDate, time);
                          return <option key={time} value={time} disabled={isTaken || isPast}>{time} {isTaken ? "(réservé)" : isPast ? "(trop tard)" : ""}</option>;
                        })}
                      </select>
                      <label className="block mb-2 text-sm">Service</label>
                      <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full border p-2 mb-4">
                        <option>Cours particulier</option>
                        <option>Cours collectif</option>
                        <option>Travail du cheval</option>
                      </select>
                      <button onClick={handleBooking} disabled={submitting} className="w-full bg-[#C09A3C] text-white py-3 uppercase text-sm disabled:opacity-50">
                        {submitting ? "Réservation..." : "Réserver (1 crédit)"}
                      </button>
                      <p className="text-xs mt-2">Votre solde : {user.credits} crédits</p>
                    </>
                  )}

                  {/* Historique de mes réservations */}
                  <div className="mt-8">
                    <div className="flex gap-2 mb-4">
                      {["upcoming", "past", "all"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFilter(f as any)}
                          className={`px-3 py-1 text-[10px] uppercase tracking-wider ${
                            filter === f ? "bg-[#C09A3C] text-white" : "bg-[#F8F3EC] text-[#1C1814]/60"
                          }`}
                        >
                          {f === "upcoming" ? "À venir" : f === "past" ? "Passées" : "Toutes"}
                        </button>
                      ))}
                    </div>
                    <h3 className="text-sm font-medium mb-2 text-[#C09A3C]">Mes réservations</h3>
                    {filteredBookings.length === 0 ? (
                      <p className="text-sm text-gray-500">Aucune réservation.</p>
                    ) : (
                      <ul className="space-y-2">
                        {filteredBookings.map((b) => (
                          <li key={b.id} className="border-b border-[#C09A3C]/10 py-2 flex justify-between items-center">
                            <span className="text-sm">{b.date} à {b.time} · {b.service}</span>
                            {b.date >= today && b.user_id === user.id && (
                              <button onClick={() => handleCancel(b.id)} className="text-red-500 text-xs">Annuler</button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}