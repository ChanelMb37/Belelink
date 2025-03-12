import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import  cors from "cors";

admin.initializeApp();
const corsHandler = cors({ origin: true }); // Autorise toutes les origines

exports.sendNotification = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, async () => { // Ajout de `return` ici ✅
        if (req.method !== "POST") {
            return res.status(400).send("Méthode non autorisée");
        }

        try {
            const idToken = req.headers.authorization?.split("Bearer ")[1];
            if (!idToken) {
                return res.status(401).send("Non autorisé");
            }

            const decodedToken = await admin.auth().verifyIdToken(idToken);
            console.log("✅ Utilisateur authentifié :", decodedToken.uid);

            const adminUsersSnapshot = await admin.firestore()
                .collection("users")
                .where("role", "==", "admin")
                .get();

            const adminTokens: string[] = [];
            adminUsersSnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.fcmToken) {
                    adminTokens.push(userData.fcmToken);
                }
            });

            if (adminTokens.length === 0) {
                return res.status(400).send("Aucun administrateur trouvé avec un token FCM.");
            }

            const { title, body } = req.body;
            if (!title || !body) {
                return res.status(400).send("Données incomplètes");
            }

            const message = {
                notification: { title, body },
                tokens: adminTokens,
            };

            await admin.messaging().sendEachForMulticast(message);
            return res.status(200).send("✅ Notification envoyée !");
        } catch (error) {
            console.error("❌ Erreur :", error);
            return res.status(500).send(error); // Ajout de `return` ici ✅
        }
    });
});


