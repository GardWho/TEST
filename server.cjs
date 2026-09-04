const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ============================================
// IMPORTANT POUR SUPABASE (ne pas supprimer)
// ============================================
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// ROUTE : Créer une session de paiement Stripe
// ============================================
app.post('/api/create-checkout-session', async (req, res) => {
  const { items, deliveryKm, userId, userEmail } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'Panier vide' });

  try {
    const lineItems = items.map((item) => ({
      price_data: { currency: 'eur', product_data: { name: item.label }, unit_amount: Math.round(item.price * 100) },
      quantity: item.quantity,
    }));

    let deliveryFee = 0;
    if (deliveryKm > 15) {
      deliveryFee = (deliveryKm - 15) * 0.50;
      lineItems.push({ price_data: { currency: 'eur', product_data: { name: `Frais de déplacement (${deliveryKm} km)` }, unit_amount: Math.round(deliveryFee * 100) }, quantity: 1 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'https://rg-equitation-education-equine.fr'}/compte?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://rg-equitation-education-equine.fr'}/panier?canceled=true`,
      customer_email: userEmail,
      metadata: { userId, deliveryKm: deliveryKm.toString(), items: JSON.stringify(items.map(i => ({ label: i.label, quantity: i.quantity, serviceType: i.serviceType }))) },
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
  if (!address || address.length < 5) return res.status(400).json({ error: 'Adresse invalide' });

  const instructorAddress = '24 rue Minvielle, Bordeaux, France';

  try {
    const geoUserResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=jsonv2&limit=1`, { headers: { 'User-Agent': 'RG-EQUITATION/1.0' } });
    const userData = await geoUserResponse.json();
    if (!userData || userData.length === 0) return res.status(404).json({ error: 'Adresse utilisateur non trouvée.' });

    const userLat = parseFloat(userData[0].lat);
    const userLon = parseFloat(userData[0].lon);

    const geoInstructorResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(instructorAddress)}&format=jsonv2&limit=1`, { headers: { 'User-Agent': 'RG-EQUITATION/1.0' } });
    const instructorData = await geoInstructorResponse.json();
    if (!instructorData || instructorData.length === 0) return res.status(404).json({ error: 'Adresse du moniteur non trouvée.' });

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

    res.json({ distanceKm, distanceSimple, address: userData[0].display_name, instructorAddress: instructorData[0].display_name });
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
  if (!nom || !prenom || !telephone || !message) return res.status(400).json({ error: 'Tous les champs sont requis' });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ionos.fr',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER || 'contact@rg-equitation-education-equine.fr', pass: process.env.SMTP_PASSWORD },
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
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email.' });
  }
});

// ============================================
// ROUTE : Créer une réservation (avec notification email)
// ============================================
app.post('/api/create-booking', async (req, res) => {
  const { userId, date, time, service, email } = req.body;
  console.log('🔍 create-booking reçu:', { userId, date, time, service, email });

  if (!userId || !date || !time || !service) return res.status(400).json({ error: 'Tous les champs sont requis' });

  try {
    // Vérifier que le créneau n'est pas déjà réservé
    const { data: existing } = await supabase.from('bookings').select('*').eq('date', date).eq('time', time).maybeSingle();
    if (existing) return res.status(409).json({ error: 'Ce créneau est déjà réservé.' });

    // Chercher le profil par email (car l'ID peut ne pas correspondre)
    let profile = null;
    if (email) {
      const { data: profileByEmail } = await supabase.from('profiles').select('id, email, credits').eq('email', email).maybeSingle();
      profile = profileByEmail;
    }
    if (!profile) {
      const { data: profileById } = await supabase.from('profiles').select('id, email, credits').eq('id', userId).maybeSingle();
      profile = profileById;
    }

    if (!profile) {
      console.error('❌ Aucun profil trouvé pour email:', email, 'ou id:', userId);
      return res.status(404).json({ error: 'Profil introuvable. Contactez le support.' });
    }

    if (profile.credits < 1) return res.status(400).json({ error: 'Crédits insuffisants.' });

    // Consommer le crédit via la fonction RPC
    const { data: success, error: rpcError } = await supabase.rpc('use_credit', { p_user_id: profile.id, p_amount: 1 });
    if (rpcError || !success) return res.status(400).json({ error: 'Impossible de consommer le crédit.' });

    // Insérer la réservation
    const { error: insertError } = await supabase.from('bookings').insert({ user_id: profile.id, date, time, service });
    if (insertError) return res.status(500).json({ error: insertError.message });

    // Envoyer email admin (non bloquant)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ionos.fr',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER || 'contact@rg-equitation-education-equine.fr', pass: process.env.SMTP_PASSWORD },
      });
      await transporter.sendMail({
        from: `"Site RG Équitation" <${process.env.SMTP_USER}>`,
        to: 'contact@rg-equitation-education-equine.fr',
        subject: 'Nouvelle réservation',
        html: `<p>Une nouvelle réservation a été effectuée :</p><ul><li><strong>Date :</strong> ${date}</li><li><strong>Heure :</strong> ${time}</li><li><strong>Service :</strong> ${service}</li></ul>`,
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
    }

    res.json({ success: true, message: 'Réservation créée avec succès.' });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation.' });
  }
});

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
      if (item.serviceType === 'cours' || item.serviceType === 'travail') creditsToAdd += item.quantity;
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

// ============================================
// Démarrer le serveur
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});