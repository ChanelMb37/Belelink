import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service'; // 🔹 Import du service d'authentification
import { environment } from '../environments/environment'; // 🔹 Import des variables d'environnement

export interface NotificationPayload {
  title: string;  
  body: string;   
  missionId: string; 
}

@Injectable({
  providedIn: 'root' 
})
export class MessagingService { // ✅ Assure-toi que "export" est bien présent ici
  constructor(
    private http: HttpClient, 
    private authService: AuthService 
  ) {}

  sendNotification(payload: NotificationPayload): Promise<void> {
    return this.authService.getToken().then((token: string | null) => {
      if (!token) {
        throw new Error("Utilisateur non authentifié !");
      }

      return this.http.post(
        'https://us-central1-engagebenevole.cloudfunctions.net/sendNotification', 
        payload, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      ).toPromise()
      .then(() => console.log("📩 Notification envoyée avec succès !")) 
      .catch(error => console.error("❌ Erreur lors de l'envoi de la notification :", error));
    });
  }
}
