import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service'; // 🔹 Import du service d'authentification
import { environment } from '../environments/environment'; // 🔹 Import des variables d'environnement

// 📌 Définition de l'interface pour structurer les données de notification
export interface NotificationPayload {
  title: string;  // 📌 Titre de la notification
  body: string;   // 📌 Contenu du message
  missionId: string; // 📌 Identifiant de la mission concernée
}

@Injectable({
  providedIn: 'root' // 🔥 Permet d'injecter ce service dans toute l'application
})
export class MessagingService {

  constructor(
    private http: HttpClient, // 🔹 Service HTTP pour envoyer les requêtes au serveur
    private authService: AuthService // 🔹 Service d'authentification pour récupérer le token utilisateur
  ) {}

  /**
   * 🚀 Envoie une notification via Firebase Cloud Messaging (FCM).
   * @param payload Objet contenant le titre, le corps et l'ID de la mission.
   * @returns Une promesse `Promise<void>` qui résout après l'envoi de la notification.
   */
  sendNotification(payload: NotificationPayload): Promise<void> {
    return this.authService.getToken().then((token: string | null) => {
      if (!token) {
        throw new Error("Utilisateur non authentifié !"); // ⚠️ Vérification de l'authentification
      }

      // 🔹 Envoi de la notification à Firebase Cloud Functions
      return this.http.post(
        'https://us-central1-engagebenevole.cloudfunctions.net/sendNotification', // 🔥 URL de l'API de notification
        payload, // 📩 Données de la notification
        {
          headers: {
            'Content-Type': 'application/json', // 📌 Indique que les données sont en format JSON
            'Authorization': `Bearer ${token}` // 🔑 Ajout du token d'authentification pour sécuriser la requête
          }
        }
      ).toPromise()
      .then(() => console.log("📩 Notification envoyée avec succès !")) // ✅ Confirmation de l'envoi
      .catch(error => console.error("❌ Erreur lors de l'envoi de la notification :", error)); // ❌ Gestion des erreurs
    });
  }
}
