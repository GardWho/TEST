const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
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
    // Construction des line_items pour Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.label,
        },
        unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    }));

    // Ajouter les frais de déplacement si > 15 km
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
// ROUTE : Calculer la distance réelle
// ============================================
app.post('/api/calculate-distance', async (req, res) => {
  const { address } = req.body;
  
  if (!address || address.length < 5) {
    return res.status(400).json({ error: 'Adresse invalide' });
  }

  const instructorAddress = '24 rue Minvielle, Bordeaux, France';
  
  try {
    // 1. Géocoder l'adresse utilisateur
    const geoUserResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'RG-EQUITATION/1.0' } }
    );
    const userData = await geoUserResponse.json();

    if (!userData || userData.length === 0) {
      return res.status(404).json({ error: 'Adresse utilisateur non trouvée. Vérifiez votre saisie.' });
    }

    const userLat = parseFloat(userData[0].lat);
    const userLon = parseFloat(userData[0].lon);

    // 2. Géocoder l'adresse du moniteur
    const geoInstructorResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(instructorAddress)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'RG-EQUITATION/1.0' } }
    );
    const instructorData = await geoInstructorResponse.json();

    if (!instructorData || instructorData.length === 0) {
      return res.status(404).json({ error: 'Adresse du moniteur non trouvée.' });
    }

    const instructorLat = parseFloat(instructorData[0].lat);
    const instructorLon = parseFloat(instructorData[0].lon);

    // 3. Calculer la distance avec OSRM (route réelle)
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${instructorLon},${instructorLat}?overview=false`;
    const osrmResponse = await fetch(osrmUrl);
    const osrmData = await osrmResponse.json();

    if (!osrmData.routes || osrmData.routes.length === 0) {
      return res.status(404).json({ error: 'Impossible de calculer l\'itinéraire.' });
    }

    const distanceMeters = osrmData.routes[0].distance;
    const distanceKm = Math.round(distanceMeters / 1000);

    res.json({ 
      distanceKm, 
      address: userData[0].display_name,
      instructorAddress: instructorData[0].display_name
    });

  } catch (error) {
    console.error('Erreur calcul distance:', error);
    res.status(500).json({ error: 'Erreur lors du calcul de la distance.' });
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

  // Gérer les événements
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Paiement réussi pour:', session.customer_email);
    // Ici tu peux ajouter des crédits à l'utilisateur, etc.
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