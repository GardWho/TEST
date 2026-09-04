import { useState } from "react";
import { useAuth } from "../AuthContext";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

type Tab = "profil" | "historique" | "credits" | "reservations";

export function ComptePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState("");

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
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id);
    if (error) setError(error.message);
    else setBookings(data || []);
  };

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "reservations") fetchBookings();
  };

  const today = new Date().toISOString().split("T")[0];
  const filteredBookings = bookings.filter((b) => {
    if (filter === "upcoming") return b.date >= today;
    if (filter === "past") return b.date < today;
    return true;
  });

  const handleCancel = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) setError(error.message);
    else fetchBookings();
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
            { id: "reservations", label: "Mes réservations" },
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

          {activeTab === "reservations" && (
            <div>
              <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Mes réservations</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="flex gap-3 mb-6">
                {[
                  { id: "upcoming", label: "À venir" },
                  { id: "past", label: "Passées" },
                  { id: "all", label: "Toutes" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as any)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider ${
                      filter === f.id ? "bg-[#C09A3C] text-white" : "bg-[#F8F3EC] text-[#1C1814]/60"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {filteredBookings.length === 0 ? (
                <p className="text-[#1C1814]/40">Aucune réservation.</p>
              ) : (
                <ul className="space-y-2">
                  {filteredBookings.map((b) => (
                    <li key={b.id} className="border-b border-[#C09A3C]/15 py-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm">{b.date} à {b.time} · {b.service}</p>
                      </div>
                      {b.date >= today && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="text-red-500 text-xs"
                        >
                          Annuler
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}