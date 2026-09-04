import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { supabase } from "../../lib/supabase";

export function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

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

  const addCreditsToUser = async () => {
    if (!selectedUser || creditAmount <= 0) return;
    const { error } = await supabase
      .rpc("add_credits", { p_user_id: selectedUser.id, p_amount: creditAmount });
    if (error) setError(error.message);
    else {
      alert(`Crédits ajoutés à ${selectedUser.email}`);
      setSelectedUser(null);
      fetchUsers();
    }
  };

  const deleteBooking = async (bookingId: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", bookingId);
    if (error) setError(error.message);
    else {
      alert("Réservation annulée");
      fetchBookings();
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
    <div className="min-h-screen bg-[#F5EFE4] pt-32 px-8 md:px-14">
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
                      setCreditAmount(1);
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
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value))}
                className="w-full border p-2"
              />
              <button
                onClick={addCreditsToUser}
                className="mt-4 bg-[#C09A3C] text-white px-4 py-2 uppercase text-sm"
              >
                Valider
              </button>
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