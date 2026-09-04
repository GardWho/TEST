import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { createClient } from "@supabase/supabase-js";
import { config } from "../../config";

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

export function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    // Sélection explicite des colonnes
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, credits, role");
    if (error) setError(error.message);
    else setUsers(data || []);
    setLoading(false);
  };

  const addCreditsToUser = async () => {
    if (!selectedUser || creditAmount <= 0) return;
    const newCredits = selectedUser.credits + creditAmount;
    const { error } = await supabase
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", selectedUser.id);
    if (error) setError(error.message);
    else {
      alert(`Crédits ajoutés à ${selectedUser.email}`);
      setSelectedUser(null);
      fetchUsers();
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

        {/* Colonne droite : formulaire d'ajout de crédits */}
        <div>
          {selectedUser ? (
            <div className="bg-white p-6 rounded-sm">
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
          ) : (
            <p className="text-sm text-gray-500">
              Cliquez sur un utilisateur pour lui ajouter des crédits.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}