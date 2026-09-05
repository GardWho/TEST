const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ============================================
// IMPORT SUPABASE (BACKEND) — Realtime désactivé (évite crash Node 20)
// ============================================
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false }, realtime: { transport: null } }
);

const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
});

app.use(cors());

// ============================================
// ROUTE : Webhook Stripe (crédit automatique après paiement)
// ============================================
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const items = JSON.parse(session.metadata.items);

    let creditsToAdd = 0;
    for (const item of items) {
      if (item.serviceType === 'cours' || item.serviceType === 'travail') {
        creditsToAdd += item.quantity;
      }
    }

    if (creditsToAdd > 0 && userId) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (profile) {
        const newCredits = profile.credits + creditsToAdd;
        await supabase.from('profiles').update({ credits: newCredits }).eq('id', userId);
        console.log(`✅ ${creditsToAdd} crédits ajoutés à ${userId}`);
      }
    }
  }

  res.json({ received: true });
});

// Pour toutes les AUTRES routes, on peut lire le JSON normalement.
app.use(express.json());

// ============================================
// Petit utilitaire : identifier l'utilisateur à partir du token
// ============================================
async function getUserFromRequest(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

// ============================================
// ROUTE : Créer une session de paiement Stripe
// ============================================
app.post('/api/create-checkout-session', async (req, res) => {
  const { items, deliveryKm, userId, userEmail } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Panier vide' });
  }

  try {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.label,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    let deliveryFee = 0;
    if (deliveryKm > 15) {
      deliveryFee = (deliveryKm - 15) * 0.50;
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Frais de déplacement (${deliveryKm} km)`,
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'https://rg-equitation-education-equine.fr'}/compte?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://rg-equitation-education-equine.fr'}/panier?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        deliveryKm: deliveryKm.toString(),
        items: JSON.stringify(items.map(i => ({ label: i.label, quantity: i.quantity, serviceType: i.serviceType })))
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTE : Calculer la distance (aller-retour)
// ============================================
app.post('/api/calculate-distance', async (req, res) => {
  const { address } = req.body;

  if (!address || address.length < 5) {
    return res.status(400).json({ error: 'Adresse invalide' });
  }

  const instructorAddress = '24 rue Minvielle, Bordeaux, France';

  try {
    const geoUserResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=jsonv2&limit=1`,
      { headers: { 'User-Agent': 'RG-EQUITATION/1.0' } }
    );
    const userData = await geoUserResponse.json();

    if (!userData || userData.length === 0) {
      return res.status(404).json({ error: 'Adresse utilisateur non trouvée. Vérifiez votre saisie.' });
    }

    const userLat = parseFloat(userData[0].lat);
    const userLon = parseFloat(userData[0].lon);

    const geoInstructorResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(instructorAddress)}&format=jsonv2&limit=1`,
      { headers: { 'User-Agent': 'RG-EQUITATION/1.0' } }
    );
    const instructorData = await geoInstructorResponse.json();

    if (!instructorData || instructorData.length === 0) {
      return res.status(404).json({ error: 'Adresse du moniteur non trouvée.' });
    }

    const instructorLat = parseFloat(instructorData[0].lat);
    const instructorLon = parseFloat(instructorData[0].lon);

    const toRad = (deg) => deg * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(instructorLat - userLat);
    const dLon = toRad(instructorLon - userLon);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(userLat)) * Math.cos(toRad(instructorLat)) * Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceSimple = Math.round(R * c);
    const distanceKm = distanceSimple * 2;

    res.json({
      distanceKm,
      distanceSimple,
      address: userData[0].display_name,
      instructorAddress: instructorData[0].display_name,
    });

  } catch (error) {
    console.error('Erreur calcul distance:', error);
    res.status(500).json({ error: 'Erreur lors du calcul de la distance.' });
  }
});

// ============================================
// ROUTE : Envoyer un email de contact (SMTP IONOS)
// ============================================
app.post('/api/send-email', async (req, res) => {
  const { nom, prenom, telephone, categorie, message } = req.body;

  if (!nom || !prenom || !telephone || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ionos.fr',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'contact@rg-equitation-education-equine.fr',
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Formulaire de contact" <${process.env.SMTP_USER}>`,
      to: 'contact@rg-equitation-education-equine.fr',
      subject: `Nouveau message de ${prenom} ${nom}`,
      text: `Nom : ${nom}\nPrénom : ${prenom}\nTéléphone : ${telephone}\nCatégorie : ${categorie || 'Non précisée'}\n\nMessage :\n${message}`,
      html: `<h2>Nouveau message de contact</h2><p><strong>Nom :</strong> ${nom}</p><p><strong>Prénom :</strong> ${prenom}</p><p><strong>Téléphone :</strong> ${telephone}</p><p><strong>Catégorie :</strong> ${categorie || 'Non précisée'}</p><p><strong>Message :</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email envoyé avec succès' });

  } catch (error) {
    console.error('Erreur SMTP:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email. Vérifiez vos identifiants SMTP.' });
  }
});

// ============================================
// ROUTE : Créer une réservation
// ============================================
app.post('/api/create-booking', async (req, res) => {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Session expirée, merci de vous reconnecter.' });
    }

    const { date, time, service } = req.body;
    if (!date || !time || !service) {
      return res.status(400).json({ error: 'Date, horaire et service sont requis.' });
    }

    const { data: existing, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (checkError) {
      console.error('Erreur vérification créneau:', checkError.message);
      return res.status(500).json({ error: 'Erreur lors de la vérification du créneau.' });
    }
    if (existing) {
      return res.status(409).json({ error: 'Ce créneau est déjà réservé.' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profil introuvable.' });
    }
    if ((profile.credits ?? 0) < 1) {
      return res.status(400).json({ error: 'Crédits insuffisants.' });
    }

    const newCredits = profile.credits - 1;
    const { error: debitError } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', authUser.id);

    if (debitError) {
      console.error('Erreur débit crédit:', debitError.message);
      return res.status(500).json({ error: 'Erreur lors du débit du crédit.' });
    }

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({ user_id: authUser.id, date, time, service })
      .select()
      .single();

    if (insertError) {
      await supabase.from('profiles').update({ credits: profile.credits }).eq('id', authUser.id);
      console.error('Erreur création réservation:', insertError.message);
      return res.status(500).json({ error: 'Erreur lors de la création de la réservation.' });
    }

    return res.status(200).json({ booking, credits: newCredits });
  } catch (err) {
    console.error('Erreur inattendue /api/create-booking:', err);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ============================================
// ROUTE : Annuler une réservation (rembourse le crédit au propriétaire)
// ============================================
app.post('/api/cancel-booking', async (req, res) => {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Session expirée, merci de vous reconnecter.' });
    }

    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId requis.' });
    }

    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, user_id')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: 'Réservation introuvable.' });
    }

    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single();

    const isOwner = booking.user_id === authUser.id;
    const isAdmin = callerProfile?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Vous ne pouvez annuler que vos propres réservations.' });
    }

    const { error: deleteError } = await supabase.from('bookings').delete().eq('id', bookingId);
    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    const { data: ownerProfile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', booking.user_id)
      .single();

    if (ownerProfile) {
      await supabase
        .from('profiles')
        .update({ credits: ownerProfile.credits + 1 })
        .eq('id', booking.user_id);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur inattendue /api/cancel-booking:', err);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ============================================
// ROUTE : Un admin ajoute des crédits à un utilisateur
// ============================================
app.post('/api/admin-add-credits', async (req, res) => {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Session expirée, merci de vous reconnecter.' });
    }

    const { data: callerProfile, error: callerError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single();

    if (callerError || callerProfile?.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
    }

    const { targetUserId, amount } = req.body;
    const parsedAmount = Number(amount);

    if (!targetUserId || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Paramètres invalides : montant ou utilisateur manquant.' });
    }

    const { data: targetProfile, error: targetError } = await supabase
      .from('profiles')
      .select('credits, email')
      .eq('id', targetUserId)
      .single();

    if (targetError || !targetProfile) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    const newCredits = targetProfile.credits + parsedAmount;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', targetUserId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({ credits: newCredits, email: targetProfile.email });
  } catch (err) {
    console.error('Erreur inattendue /api/admin-add-credits:', err);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ============================================
// ROUTE : Récupérer toutes les réservations (calendrier partagé)
// ============================================
app.get('/api/bookings', async (req, res) => {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Session expirée, merci de vous reconnecter.' });
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('id, date, time, service, user_id')
      .order('date', { ascending: true });

    if (error) {
      console.error('Erreur récupération réservations:', error.message);
      return res.status(500).json({ error: 'Erreur lors de la récupération des réservations.' });
    }

    res.status(200).json({ bookings: data });
  } catch (err) {
    console.error('Erreur inattendue /api/bookings:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ============================================
// 404 et erreurs : toujours répondre en JSON, jamais en HTML.
// ============================================
app.use((req, res) => {
  res.status(404).json({ error: `Route introuvable : ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// ============================================
// Démarrer le serveur
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});