import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { SEO } from "../components/SEO";

type Profile = { id: string; email: string; full_name: string | null; credits: number; role: string };
type BookingRow = { id: string; date: string; time: string; service: string; profiles?: { email?: string; full_name?: string } | null };

export function AdminPage() {
  const { user } = useAuth();
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
    const res = await fetch('/api/admin/users', { credentials: 'include' });
    const data = await res.json();
    if (res.ok) setUsers(data.users || []);
    else setError(data.error || 'Erreur');
    setLoading(false);
  };

  const fetchBookings = async () => {
    const res = await fetch('/api/admin/bookings', { credentials: 'include' });
    const data = await res.json();
    if (res.ok) setBookings(data.bookings || []);
    else setError(data.error || 'Erreur');
  };

  const addCreditsToUser = async () => {
    if (!selectedUser) return;
    const amount = parseInt(creditAmount, 10);
    if (!Number.isFinite(amount) || amount <= 0) { setError("Montant invalide"); return; }
    setSaving(true);
    setError("");
    const res = await fetch('/api/admin/add-credits', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: selectedUser.id, amount })
    });
    const data = await res.json();
    if (res.ok) {
      alert(`${amount} crédit(s) ajouté(s) à ${selectedUser.email}`);
      setSelectedUser(null);
      setCreditAmount("1");
      fetchUsers();
    } else {
      setError(data.error || 'Erreur');
    }
    setSaving(false);
  };

  const deleteBooking = async (bookingId: string) => {
    const res = await fetch('/api/cancel-booking', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId })
    });
    const data = await res.json();
    if (res.ok) {
      alert("Réservation annulée");
      fetchBookings();
      fetchUsers();
    } else {
      setError(data.error || 'Erreur');
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4]">

        <SEO
          title="Administration | RG Équitation"
          description="Espace d'administration réservé."
          canonical="https://rg-equitation-education-equine.fr/admin"
          noindex={true}
        />

        <p>Accès réservé aux administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4] pt-32 px-8 md:px-14 pb-16">

      <SEO
        title="Administration | RG Équitation"
        description="Espace d'administration RG Équitation : gestion des utilisateurs, crédits et réservations."
        canonical="https://rg-equitation-education-equine.fr/admin"
        noindex={true}
      />

      <h1 className="text-3xl font-normal mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Administration</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-normal mb-4">Liste des utilisateurs</h2>
          {loading ? <p className="text-sm text-gray-500">Chargement...</p> : (
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u.id} className="bg-white p-4 rounded-sm flex justify-between items-center">
                  <div>
                    <p className="font-medium">{u.email}</p>
                    <p className="text-sm text-gray-500">{u.full_name || "Nom non défini"} - {u.credits} crédits - {u.role}</p>
                  </div>
                  <button onClick={() => { setSelectedUser(u); setCreditAmount("1"); setError(""); }} className="bg-[#C09A3C] text-white px-3 py-1 text-xs uppercase">Ajouter crédits</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {selectedUser && (
            <div className="bg-white p-6 rounded-sm mb-6">
              <h3 className="text-lg font-normal mb-4">Ajouter des crédits</h3>
              <p>Utilisateur : <strong>{selectedUser.email}</strong></p>
              <p>Crédits actuels : {selectedUser.credits}</p>
              <label className="block mt-4 mb-2">Montant à ajouter</label>
              <input type="number" min="1" step="1" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} className="w-full border p-2" />
              <div className="flex gap-3 mt-4">
                <button onClick={addCreditsToUser} disabled={saving} className="bg-[#C09A3C] text-white px-4 py-2 uppercase text-sm disabled:opacity-50">{saving ? "Enregistrement..." : "Valider"}</button>
                <button onClick={() => setSelectedUser(null)} className="px-4 py-2 uppercase text-sm text-[#1C1814]/50 hover:text-[#1C1814]">Annuler</button>
              </div>
            </div>
          )}
          <div className="bg-white p-6 rounded-sm">
            <h2 className="text-xl font-normal mb-4">Réservations</h2>
            {bookings.length === 0 ? <p className="text-sm text-gray-500">Aucune réservation pour le moment.</p> : (
              <ul className="space-y-2">
                {bookings.map((b) => (
                  <li key={b.id} className="bg-[#F8F3EC] p-3 rounded-sm flex justify-between items-center">
                    <div>
                      <p className="text-sm">{b.date} à {b.time} - {b.service}</p>
                      <p className="text-xs text-gray-500">{b.profiles?.email || "Utilisateur inconnu"}</p>
                    </div>
                    <button onClick={() => deleteBooking(b.id)} className="text-red-500 text-xs">Annuler</button>
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