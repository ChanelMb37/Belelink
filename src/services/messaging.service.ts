import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service'; 
import { environment } from '../environments/environment'; 
// 📌 Interface représentant le format des notifications à envoyer
export interface NotificationPayload {
  title: string;   // 🔹 Titre de la notification
  body: string;    // 🔹 Contenu/message de la notification
  missionId: string; // 🔹 Identifiant de la mission concernée par la notification
}

@Injectable({
  providedIn: 'root' // ✅ Rend ce service disponible dans toute l'application
})
export class MessagingService { 
  constructor(
    private http: HttpClient, // 🔹 Service Angular permettant d'effectuer des requêtes HTTP
    private authService: AuthService // 🔹 Service d'authentification pour récupérer le token de l'utilisateur
  ) {}

  /**
   * 📩 Envoie une notification à un utilisateur via une fonction cloud.
   * @param payload Contenu de la notification (titre, message et ID de mission).
   * @returns Une promesse qui se résout lorsque l'envoi est terminé.
   */
  sendNotification(payload: NotificationPayload): Promise<void> {
    return this.authService.getToken().then((token: string | null) => {
      if (!token) { 
        throw new Error("Utilisateur non authentifié !"); // 🚨 Empêche l'envoi si l'utilisateur n'est pas authentifié
      }

      // 📡 Envoi de la notification via une requête HTTP POST à une fonction cloud Firebase
      return this.http.post(
        'https://us-central1-engagebenevole.cloudfunctions.net/sendNotification', // 🔥 URL de la fonction cloud
        payload, // 📌 Données envoyées (titre, message, missionId)
        {
          headers: {
            'Content-Type': 'application/json', // 📝 Indique que les données sont envoyées en JSON
            'Authorization': `Bearer ${token}` // 🔑 Ajoute le token Firebase pour sécuriser la requête
          }
        }
      ).toPromise() // ✅ Convertit l'Observable en Promise
      .then(() => console.log("📩 Notification envoyée avec succès !")) // ✅ Affiche un message de succès en console
      .catch(error => console.error("❌ Erreur lors de l'envoi de la notification :", error)); // 🚨 Capture et affiche les erreurs
    });
  }
}
