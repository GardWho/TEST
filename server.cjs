const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

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
// ROUTE : Calculer la distance (CORRIGÉE)
// ============================================
app.post('/api/calculate-distance', async (req, res) => {
  const { address } = req.body;

  if (!address || address.length < 5) {
    return res.status(400).json({ error: 'Adresse invalide' });
  }

  const instructorAddress = '24 rue Minvielle, Bordeaux, France';

  try {
    // 1. Géocodage de l'adresse utilisateur
    const geoUserUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=jsonv2&limit=1`;
    console.log('🔍 Requête utilisateur:', geoUserUrl);

    const geoUserResponse = await fetch(geoUserUrl, {
      headers: {
        'User-Agent': 'RG-EQUITATION/1.0',
        'Accept': 'application/json',
      },
    });

    if (!geoUserResponse.ok) {
      const text = await geoUserResponse.text();
      console.error('Erreur Nominatim utilisateur:', text);
      return res.status(500).json({ error: 'Erreur lors du géocodage de votre adresse.' });
    }

    let userData;
    try {
      userData = await geoUserResponse.json();
    } catch (parseError) {
      console.error('Erreur de parsing JSON utilisateur:', parseError);
      const text = await geoUserResponse.text();
      console.error('Réponse brute:', text);
      return res.status(500).json({ error: 'Réponse inattendue du service de géocodage.' });
    }

    if (!userData || userData.length === 0) {
      return res.status(404).json({ error: 'Adresse utilisateur non trouvée. Vérifiez votre saisie.' });
    }

    const userLat = parseFloat(userData[0].lat);
    const userLon = parseFloat(userData[0].lon);

    // 2. Géocodage de l'adresse du moniteur
    const geoInstructorUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(instructorAddress)}&format=jsonv2&limit=1`;
    console.log('🔍 Requête moniteur:', geoInstructorUrl);

    const geoInstructorResponse = await fetch(geoInstructorUrl, {
      headers: {
        'User-Agent': 'RG-EQUITATION/1.0',
        'Accept': 'application/json',
      },
    });

    if (!geoInstructorResponse.ok) {
      const text = await geoInstructorResponse.text();
      console.error('Erreur Nominatim moniteur:', text);
      return res.status(500).json({ error: 'Erreur lors du géocodage de l\'adresse du moniteur.' });
    }

    let instructorData;
    try {
      instructorData = await geoInstructorResponse.json();
    } catch (parseError) {
      console.error('Erreur de parsing JSON moniteur:', parseError);
      const text = await geoInstructorResponse.text();
      console.error('Réponse brute:', text);
      return res.status(500).json({ error: 'Réponse inattendue du service de géocodage.' });
    }

    if (!instructorData || instructorData.length === 0) {
      return res.status(404).json({ error: 'Adresse du moniteur non trouvée.' });
    }

    const instructorLat = parseFloat(instructorData[0].lat);
    const instructorLon = parseFloat(instructorData[0].lon);

    // 3. Calcul de la distance (formule de Haversine)
    const toRad = (deg) => deg * Math.PI / 180;
    const R = 6371; // Rayon de la Terre en km

    const dLat = toRad(instructorLat - userLat);
    const dLon = toRad(instructorLon - userLon);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(userLat)) * Math.cos(toRad(instructorLat)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c);

    res.json({
      distanceKm,
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
      text: `
Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${telephone}
Catégorie : ${categorie || 'Non précisée'}

Message :
${message}
      `,
      html: `
<h2>Nouveau message de contact</h2>
<p><strong>Nom :</strong> ${nom}</p>
<p><strong>Prénom :</strong> ${prenom}</p>
<p><strong>Téléphone :</strong> ${telephone}</p>
<p><strong>Catégorie :</strong> ${categorie || 'Non précisée'}</p>
<p><strong>Message :</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email envoyé avec succès' });

  } catch (error) {
    console.error('Erreur SMTP:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email. Vérifiez vos identifiants SMTP.' });
  }
});

// ============================================
// ROUTE : Webhook Stripe (optionnel)
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
    console.log('Paiement réussi pour:', session.customer_email);
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