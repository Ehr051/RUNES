const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.gumroadWebhook = functions.https.onRequest(async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { email, product_permalink, success } = req.body;

    // Verify it's our product
    if (product_permalink !== "RUNES") {
      return res.status(400).send("Invalid product");
    }

    // Verify purchase was successful
    if (success !== "true" && success !== true) {
      return res.status(400).send("Purchase not successful");
    }

    // Find user by email in Firestore
    const usersRef = admin.firestore().collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      // User might not have signed up yet, store pending activation
      await admin.firestore().collection("pendingActivations").doc(email).set({
        email: email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        product: "RUNES"
      });
      return res.status(200).send("Pending activation stored");
    }

    // Activate Pro for the user
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({ isPremium: true });

    console.log(`Pro activated for ${email}`);
    return res.status(200).send("Pro activated");
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).send("Internal server error");
  }
});

// Check pending activations when user logs in
exports.checkPendingActivation = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be logged in");
  }

  const email = context.auth.token.email;
  if (!email) return { activated: false };

  const pendingRef = admin.firestore().collection("pendingActivations").doc(email);
  const pendingDoc = await pendingRef.get();

  if (pendingDoc.exists) {
    // Activate Pro
    const userRef = admin.firestore().collection("users").doc(context.auth.uid);
    await userRef.update({ isPremium: true });
    await pendingRef.delete();
    return { activated: true };
  }

  return { activated: false };
});
