const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');
const session = require('express-session');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Polyfill WebSocket pour Node.js 20
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = require('ws');
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Configuration session (cookie httpOnly)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true en prod, false en local
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
});

// CORS avec credentials (permet les cookies)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Webhook Stripe (avant express.json)
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
      const { data: profile } = await supabase.from('profiles').select('credits').eq('id', userId).single();
      if (profile) {
        const newCredits = profile.credits + creditsToAdd;
        await supabase.from('profiles').update({ credits: newCredits }).eq('id', userId);
        console.log(`✅ ${creditsToAdd} crédits ajoutés à ${userId}`);
      }
    }
  }
  res.json({ received: true });
});

app.use(express.json());

// ============================================
// AUTHENTIFICATION PAR SESSION (COOKIE)
// ============================================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

  try {
    // Appel direct à l'API REST Supabase pour l'authentification
    const authResponse = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      return res.status(401).json({ error: authData.msg || 'Email ou mot de passe incorrect' });
    }

    // Récupérer le profil utilisateur via l'API REST
    const userId = authData.user.id;
    const profileResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.${userId}`, {
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const profileData = await profileResponse.json();
    const profile = profileData[0] || {};

    // Stocker la session utilisateur
    req.session.user = {
      id: userId,
      email: authData.user.email,
      name: profile.full_name || 'Utilisateur',
      credits: profile.credits || 0,
      role: profile.role || 'user',
    };

    return res.json({ user: req.session.user });
  } catch (error) {
    console.error('Erreur login:', error.message);
    return res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/me', (req, res) => {
  if (req.session.user) return res.json({ user: req.session.user });
  res.status(401).json({ error: 'Non connecté' });
});

function getUserFromRequest(req) {
  return req.session.user || null;
}

// ============================================
// ROUTES EXISTANTES (adaptées pour utiliser req.session.user)
// ============================================

// Créer une session de paiement Stripe
app.post('/api/create-checkout-session', async (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Non connecté' });
  const { items, deliveryKm } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'Panier vide' });

  try {
    const lineItems = items.map(item => ({
      price_data: { currency: 'eur', product_data: { name: item.label }, unit_amount: Math.round(item.price * 100) },
      quantity: item.quantity,
    }));

    let deliveryFee = 0;
    if (deliveryKm > 15) {
      deliveryFee = (deliveryKm - 15) * 0.50;
      lineItems.push({ price_data: { currency: 'eur', product_data: { name: `Frais de déplacement (${deliveryKm} km)` }, unit_amount: Math.round(deliveryFee * 100) }, quantity: 1 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'https://rg-equitation-education-equine.fr'}/compte?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://rg-equitation-education-equine.fr'}/panier?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        deliveryKm: deliveryKm.toString(),
        items: JSON.stringify(items.map(i => ({ label: i.label, quantity: i.quantity, serviceType: i.serviceType })))
      },
    });
    res.json({ id: checkoutSession.id });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Calculer la distance
app.post('/api/calculate-distance', async (req, res) => {
  const { address } = req.body;
  if (!address || address.length < 5) return res.status(400).json({ error: 'Adresse invalide' });
  const instructorAddress = '24 rue Minvielle, Bordeaux, France';
  try {
    const geoUserResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=jsonv2&limit=1`, { headers: { 'User-Agent': 'RG-EQUITATION/1.0' } });
    const userData = await geoUserResponse.json();
    if (!userData || userData.length === 0) return res.status(404).json({ error: 'Adresse utilisateur non trouvée.' });
    const userLat = parseFloat(userData[0].lat), userLon = parseFloat(userData[0].lon);
    const geoInstructorResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(instructorAddress)}&format=jsonv2&limit=1`, { headers: { 'User-Agent': 'RG-EQUITATION/1.0' } });
    const instructorData = await geoInstructorResponse.json();
    if (!instructorData || instructorData.length === 0) return res.status(404).json({ error: 'Adresse du moniteur non trouvée.' });
    const instructorLat = parseFloat(instructorData[0].lat), instructorLon = parseFloat(instructorData[0].lon);
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(instructorLat - userLat), dLon = toRad(instructorLon - userLon);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(userLat)) * Math.cos(toRad(instructorLat)) * Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = Math.round(R * c) * 2;
    res.json({ distanceKm, address: userData[0].display_name, instructorAddress: instructorData[0].display_name });
  } catch (error) {
    console.error('Erreur calcul distance:', error);
    res.status(500).json({ error: 'Erreur lors du calcul de la distance.' });
  }
});

// Envoyer un email de contact
app.post('/api/send-email', async (req, res) => {
  const { nom, prenom, telephone, categorie, message } = req.body;
  if (!nom || !prenom || !telephone || !message) return res.status(400).json({ error: 'Tous les champs sont requis' });
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ionos.fr',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER || 'contact@rg-equitation-education-equine.fr', pass: process.env.SMTP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"Formulaire de contact" <${process.env.SMTP_USER}>`,
      to: 'contact@rg-equitation-education-equine.fr',
      subject: `Nouveau message de ${prenom} ${nom}`,
      text: `Nom : ${nom}\nPrénom : ${prenom}\nTéléphone : ${telephone}\nCatégorie : ${categorie || 'Non précisée'}\n\nMessage :\n${message}`,
      html: `<h2>Nouveau message de contact</h2><p><strong>Nom :</strong> ${nom}</p><p><strong>Prénom :</strong> ${prenom}</p><p><strong>Téléphone :</strong> ${telephone}</p><p><strong>Catégorie :</strong> ${categorie || 'Non précisée'}</p><p><strong>Message :</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    });
    res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur SMTP:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email.' });
  }
});

// Créer une réservation
app.post('/api/create-booking', async (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Non connecté' });
  const { date, time, service } = req.body;
  if (!date || !time || !service) return res.status(400).json({ error: 'Date, horaire et service sont requis.' });
  try {
    const { data: existing, error: checkError } = await supabase.from('bookings').select('id').eq('date', date).eq('time', time).maybeSingle();
    if (checkError) return res.status(500).json({ error: 'Erreur lors de la vérification du créneau.' });
    if (existing) return res.status(409).json({ error: 'Ce créneau est déjà réservé.' });
    const { data: profile, error: profileError } = await supabase.from('profiles').select('credits').eq('id', user.id).single();
    if (profileError || !profile) return res.status(404).json({ error: 'Profil introuvable.' });
    if (profile.credits < 1) return res.status(400).json({ error: 'Crédits insuffisants.' });
    const newCredits = profile.credits - 1;
    const { error: debitError } = await supabase.from('profiles').update({ credits: newCredits }).eq('id', user.id);
    if (debitError) return res.status(500).json({ error: 'Erreur lors du débit du crédit.' });
    const { data: booking, error: insertError } = await supabase.from('bookings').insert({ user_id: user.id, date, time, service }).select().single();
    if (insertError) {
      await supabase.from('profiles').update({ credits: profile.credits }).eq('id', user.id);
      return res.status(500).json({ error: 'Erreur lors de la création de la réservation.' });
    }
    res.status(200).json({ booking, credits: newCredits });
  } catch (err) {
    console.error('Erreur inattendue /api/create-booking:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// Annuler une réservation (rembourse le crédit)
app.post('/api/cancel-booking', async (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Non connecté' });
  const { bookingId } = req.body;
  if (!bookingId) return res.status(400).json({ error: 'bookingId requis.' });
  try {
    const { data: booking, error: fetchError } = await supabase.from('bookings').select('id, user_id').eq('id', bookingId).single();
    if (fetchError || !booking) return res.status(404).json({ error: 'Réservation introuvable.' });
    const { data: callerProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const isOwner = booking.user_id === user.id;
    const isAdmin = callerProfile?.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Vous ne pouvez annuler que vos propres réservations.' });
    const { error: deleteError } = await supabase.from('bookings').delete().eq('id', bookingId);
    if (deleteError) return res.status(500).json({ error: deleteError.message });
    const { data: ownerProfile } = await supabase.from('profiles').select('credits').eq('id', booking.user_id).single();
    if (ownerProfile) {
      await supabase.from('profiles').update({ credits: ownerProfile.credits + 1 }).eq('id', booking.user_id);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur inattendue /api/cancel-booking:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ROUTES ADMIN
app.get('/api/admin/users', async (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Non connecté' });
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
  const { data, error } = await supabase.from('profiles').select('id, email, full_name, credits, role');
  if (error) return res.status(500).json({ error: 'Erreur lors de la récupération.' });
  res.json({ users: data });
});

app.get('/api/admin/bookings', async (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Non connecté' });
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
  const { data, error } = await supabase.from('bookings').select('*, profiles(email, full_name)');
  if (error) return res.status(500).json({ error: 'Erreur lors de la récupération.' });
  res.json({ bookings: data });
});

app.post('/api/admin/add-credits', async (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Non connecté' });
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
  const { targetUserId, amount } = req.body;
  const parsedAmount = Number(amount);
  if (!targetUserId || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return res.status(400).json({ error: 'Paramètres invalides.' });
  const { data: targetProfile } = await supabase.from('profiles').select('credits, email').eq('id', targetUserId).single();
  if (!targetProfile) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  const newCredits = targetProfile.credits + parsedAmount;
  await supabase.from('profiles').update({ credits: newCredits }).eq('id', targetUserId);
  res.status(200).json({ credits: newCredits, email: targetProfile.email });
});

// Récupérer toutes les réservations (calendrier partagé)
app.get('/api/bookings', async (req, res) => {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Non connecté' });
  const { data, error } = await supabase.from('bookings').select('id, date, time, service, user_id').order('date', { ascending: true });
  if (error) return res.status(500).json({ error: 'Erreur lors de la récupération des réservations.' });
  res.status(200).json({ bookings: data });
});

// 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: `Route introuvable : ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});