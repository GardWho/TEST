import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { supabase } from "../../lib/supabase";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7h à 18h

export function PlanningPage() {
  const { user, useCredits } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("Cours particulier");
  const [error, setError] = useState("");

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
    if (!user) {
      alert("Veuillez vous connecter pour réserver.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert("Choisissez une date et un créneau.");
      return;
    }
    const isTaken = bookings.some(b => b.date === selectedDate && b.time === selectedTime);
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

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(b => b.date >= today);
  const past = bookings.filter(b => b.date < today);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-normal mb-4">Créneaux réservés</h2>
          <h3 className="text-sm font-medium mb-2 text-[#C09A3C]">À venir</h3>
          <ul className="space-y-2 mb-6">
            {upcoming.length === 0 && <li className="text-sm text-gray-500">Aucune réservation à venir.</li>}
            {upcoming.map((b) => (
              <li key={b.id} className="bg-white p-3 rounded-sm flex justify-between items-center">
                <span>{b.date} à {b.time} - {b.service}</span>
                {b.user_id === user.id && (
                  <button
                    onClick={async () => {
                      await supabase.from("bookings").delete().eq("id", b.id);
                      fetchBookings();
                    }}
                    className="text-red-500 text-xs"
                  >
                    Annuler
                  </button>
                )}
              </li>
            ))}
          </ul>
          <h3 className="text-sm font-medium mb-2 text-[#C09A3C]">Passées</h3>
          <ul className="space-y-2">
            {past.length === 0 && <li className="text-sm text-gray-500">Aucune réservation passée.</li>}
            {past.map((b) => (
              <li key={b.id} className="bg-white p-3 rounded-sm flex justify-between">
                <span>{b.date} à {b.time} - {b.service}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-sm">
          <h2 className="text-xl font-normal mb-4">Réserver un créneau</h2>
          <label className="block mb-2 text-sm">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border p-2 mb-4"
            min={new Date().toISOString().split("T")[0]}
          />
          <label className="block mb-2 text-sm">Horaire</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full border p-2 mb-4"
          >
            <option value="">-- Choisir --</option>
            {HOURS.map((h) => {
              const time = `${h.toString().padStart(2, "0")}:00`;
              return <option key={time} value={time}>{time}</option>;
            })}
          </select>
          <label className="block mb-2 text-sm">Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full border p-2 mb-4"
          >
            <option>Cours particulier</option>
            <option>Cours collectif</option>
            <option>Travail du cheval</option>
            <option>Rééducation</option>
            <option>Éducation équine</option>
          </select>
          <button
            onClick={handleReservation}
            className="w-full bg-[#C09A3C] text-white py-3 uppercase text-sm"
          >
            Réserver (1 crédit)
          </button>
          <p className="text-xs mt-2">Votre solde : {user.credits} crédits</p>
        </div>
      </div>
    </div>
  );
}