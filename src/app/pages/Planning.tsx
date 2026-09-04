import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { supabase } from "../../lib/supabase";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7h à 18h

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

export function PlanningPage() {
  const { user, useCredits } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("Cours particulier");
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*");
    if (error) setError(error.message);
    else setBookings(data || []);
  };

  const handleReservation = async () => {
    if (!user) return;
    if (!selectedDate || !selectedTime) {
      alert("Choisissez une date et un créneau.");
      return;
    }
    const isTaken = bookings.some(
      (b) => b.date === selectedDate && b.time === selectedTime
    );
    if (isTaken) {
      alert("Ce créneau est déjà réservé.");
      return;
    }
    const success = await useCredits(1);
    if (!success) {
      alert("Crédits insuffisants.");
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
    alert("Réservation confirmée !");
    fetchBookings();
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5EFE4] pt-20 px-8 md:px-14">
        <div className="text-center mt-20">
          <h1 className="text-3xl font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Planning partagé
          </h1>
          <p className="text-[15px] text-[#1C1814]/60">Veuillez vous connecter pour voir et réserver des créneaux.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4] pt-20 px-8 md:px-14">
      <h1 className="text-3xl font-normal mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        Planning partagé
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendrier */}
        <div className="bg-white p-6 rounded-sm">
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
              const isToday = dateStr === new Date().toISOString().split("T")[0];
              return (
                <button
                  key={index}
                  onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                  className={`h-10 rounded-sm text-sm flex flex-col items-center justify-center relative ${isToday ? "bg-[#C09A3C]/10" : ""} ${count > 0 ? "bg-[#C09A3C]/20" : "bg-[#F8F3EC]"}`}
                >
                  <span className={selectedDate === dateStr ? "text-[#C09A3C] font-bold" : ""}>{day}</span>
                  {count > 0 && <span className="text-[8px] text-[#C09A3C] mt-0.5">{count} résa</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulaire de réservation */}
        <div className="bg-white p-6 rounded-sm">
          <h2 className="text-xl font-normal mb-4">Réserver un créneau</h2>
          {!selectedDate ? (
            <p className="text-sm text-gray-500">Sélectionnez une date dans le calendrier.</p>
          ) : (
            <>
              <p className="text-sm mb-4">Date sélectionnée : <strong>{new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong></p>
              <label className="block mb-2 text-sm">Horaire</label>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full border p-2 mb-4">
                <option value="">-- Choisir --</option>
                {HOURS.map((h) => {
                  const time = `${h.toString().padStart(2, "0")}:00`;
                  const isTaken = bookings.some((b) => b.date === selectedDate && b.time === time);
                  return <option key={time} value={time} disabled={isTaken}>{time} {isTaken ? "(réservé)" : ""}</option>;
                })}
              </select>
              <label className="block mb-2 text-sm">Service</label>
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full border p-2 mb-4">
                <option>Cours particulier</option>
                <option>Cours collectif</option>
                <option>Travail du cheval</option>
                <option>Rééducation</option>
                <option>Éducation équine</option>
              </select>
              <button onClick={handleReservation} className="w-full bg-[#C09A3C] text-white py-3 uppercase text-sm">Réserver (1 crédit)</button>
              <p className="text-xs mt-2">Votre solde : {user.credits} crédits</p>
            </>
          )}

          {selectedDate && selectedDateBookings.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2 text-[#C09A3C]">Réservations ce jour</h3>
              <ul className="space-y-2">
                {selectedDateBookings.map((b) => (
                  <li key={b.id} className="bg-[#F8F3EC] p-2 rounded-sm flex justify-between text-sm">
                    <span>{b.time} - {b.service}</span>
                    {b.user_id === user.id && (
                      <button onClick={async () => { await supabase.from("bookings").delete().eq("id", b.id); fetchBookings(); }} className="text-red-500 text-xs">Annuler</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}