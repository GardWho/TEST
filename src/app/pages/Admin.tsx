import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { supabase } from "../../lib/supabase";

type Profile = { id: string; email: string; full_name: string | null; credits: number; role: string };
type BookingRow = {
  id: string;
  date: string;
  time: string;
  service: string;
  profiles?: { email?: string; full_name?: string } | null;
};

export function AdminPage() {
  const { user, session } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [creditAmount, setCreditAmount] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[]>([]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchUsers();
    fetchBookings();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, credits, role");
    if (error) setError(error.message);
    else setUsers(data || []);
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, profiles(email, full_name)");
    if (error) setError(error.message);
    else setBookings(data || []);
  };

  // Passe par le serveur pour vérifier le rôle admin
  const addCreditsToUser = async () => {
    if (!selectedUser || !session) return;

    const amount = parseInt(creditAmount, 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Merci de saisir un nombre de crédits valide (supérieur à 0).");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin-add-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ targetUserId: selectedUser.id, amount }),
      });

      let data: any = null;
      try { data = await response.json(); } catch { data = null; }

      if (!response.ok) {
        setError(data?.error || `Erreur serveur (${response.status}).`);
        return;
      }

      alert(`${amount} crédit(s) ajouté(s) à ${selectedUser.email}`);
      setSelectedUser(null);
      setCreditAmount("1");
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  };

  // Annule et rembourse le crédit
  const deleteBooking = async (bookingId: string) => {
    if (!session) return;
    try {
      const response = await fetch("/api/cancel-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      let data: any = null;
      try { data = await response.json(); } catch { data = null; }

      if (!response.ok) {
        setError(data?.error || `Erreur serveur (${response.status}).`);
        return;
      }

      alert("Réservation annulée (le crédit a été remboursé au client).");
      fetchBookings();
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur.");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4]">
        <div className="text-center">
          <p className="text-[15px] text-[#1C1814]/60">Accès réservé aux administrateurs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4] pt-32 px-8 md:px-14 pb-16">
      <h1 className="text-3xl font-normal mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
        Administration
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne gauche : liste des utilisateurs */}
        <div>
          <h2 className="text-xl font-normal mb-4">Liste des utilisateurs</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : (
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u.id} className="bg-white p-4 rounded-sm flex justify-between items-center">
                  <div>
                    <p className="font-medium">{u.email}</p>
                    <p className="text-sm text-gray-500">
                      {u.full_name || "Nom non défini"} - {u.credits} crédits - {u.role}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setCreditAmount("1");
                      setError("");
                    }}
                    className="bg-[#C09A3C] text-white px-3 py-1 text-xs uppercase"
                  >
                    Ajouter crédits
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Colonne droite : formulaire d'ajout de crédits + gestion réservations */}
        <div>
          {selectedUser && (
            <div className="bg-white p-6 rounded-sm mb-6">
              <h3 className="text-lg font-normal mb-4">Ajouter des crédits</h3>
              <p>Utilisateur : <strong>{selectedUser.email}</strong></p>
              <p>Crédits actuels : {selectedUser.credits}</p>
              <label className="block mt-4 mb-2">Montant à ajouter</label>
              <input
                type="number"
                min="1"
                step="1"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="w-full border p-2"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={addCreditsToUser}
                  disabled={saving}
                  className="bg-[#C09A3C] text-white px-4 py-2 uppercase text-sm disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : "Valider"}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 uppercase text-sm text-[#1C1814]/50 hover:text-[#1C1814]"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Liste des réservations */}
          <div className="bg-white p-6 rounded-sm">
            <h2 className="text-xl font-normal mb-4">Réservations</h2>
            {bookings.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune réservation pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {bookings.map((b) => (
                  <li key={b.id} className="bg-[#F8F3EC] p-3 rounded-sm flex justify-between items-center">
                    <div>
                      <p className="text-sm">
                        {b.date} à {b.time} - {b.service}
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.profiles?.email || "Utilisateur inconnu"}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="text-red-500 text-xs"
                    >
                      Annuler
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}