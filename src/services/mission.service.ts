import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

/**
 * 📌 Interface représentant une mission de bénévolat.
 */
export interface Mission {
  id?: string;          // 📌 Identifiant unique de la mission (généré par Firestore)
  title: string;        // 📌 Titre de la mission
  description: string;  // 📌 Description détaillée
  date: Date;          // 📌 Date prévue pour la mission
  location?: string;    // 📌 Lieu de la mission (optionnel)
  organiserId: string;  // 📌 ID de l'organisateur
  applicationsCount?: number; // 📌 Nombre de candidatures (optionnel)
}

/**
 * 📌 Service gérant les missions et les candidatures.
 */
@Injectable({
  providedIn: 'root' // 🔥 Permet à Angular d'injecter ce service automatiquement
})
export class MissionService {
  constructor(
    private firestore: AngularFirestore, // 🔹 Connexion à Firestore pour gérer les missions
    private authService: AuthService, // 🔹 Service d'authentification
    private afMessaging: AngularFireMessaging, // 🔹 Service de notifications
    private http: HttpClient // 🔹 Service HTTP pour envoyer des requêtes
  ) {}

  /**
   * 📌 Récupère la liste de toutes les missions disponibles.
   * @returns Un Observable contenant un tableau de missions.
   */
  getMissions(): Observable<Mission[]> {
    return this.firestore.collection<Mission>('missions')
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Mission;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  /**
   * 📌 Récupère une mission spécifique par son identifiant.
   * @param id Identifiant unique de la mission.
   * @returns Un Observable contenant la mission demandée.
   */
  getMissionById(id: string): Observable<Mission> {
    return this.firestore.doc<Mission>(`missions/${id}`)
      .valueChanges()
      .pipe(
        filter((data): data is Mission => !!data), // 🔹 Filtrer pour éviter les valeurs nulles
        map(data => ({ id, ...data })) // 🔹 Ajouter l'ID au document récupéré
      );
  }

  /**
   * 📌 Crée une nouvelle mission et l'ajoute dans Firestore.
   * @param mission Objet mission contenant les informations nécessaires.
   * @returns Une promesse résolue une fois la mission ajoutée.
   */
  createMission(mission: Mission): Promise<any> {
    return this.firestore.collection('missions').add(mission);
  }

  /**
   * 📌 Met à jour une mission existante dans Firestore.
   * @param id Identifiant unique de la mission.
   * @param mission Objet contenant les nouvelles valeurs.
   * @returns Une promesse résolue après mise à jour.
   */
  updateMission(id: string, mission: Partial<Mission>): Promise<void> {
    return this.firestore.doc(`missions/${id}`).update(mission);
  }

  /**
   * 📌 Supprime une mission de Firestore.
   * @param id Identifiant unique de la mission.
   * @returns Une promesse résolue après suppression.
   */
  deleteMission(id: string): Promise<void> {
    return this.firestore.doc(`missions/${id}`).delete();
  }

  /**
   * 📌 Permet à un bénévole de postuler à une mission.
   * - Vérifie si l'utilisateur est connecté.
   * - Vérifie s'il n'a pas déjà postulé.
   * - Enregistre la candidature dans Firestore.
   * - Envoie une notification après la candidature.
   * @param missionId Identifiant unique de la mission.
   * @param application Données de la candidature (nom, email, motivation...).
   * @throws Erreur si l'utilisateur est déjà candidat.
   */
  async applyToMission(missionId: string, application: any): Promise<void> {
    const user = await this.authService.getCurrentUser(); // 🔹 Vérifie l'authentification
    if (!user) {
      throw new Error("Vous devez être connecté pour postuler.");
    }

    const applicationRef = this.firestore.collection(`missions/${missionId}/applications`);

    // 🔹 Vérifie si l'utilisateur a déjà postulé en cherchant son email
    const snapshot = await applicationRef.ref.where("email", "==", application.email).get();
    if (!snapshot.empty) {
      throw new Error("Vous avez déjà postulé à cette mission.");
    }

    // 🔹 Enregistre la candidature dans Firestore
    await applicationRef.add(application);

    // 🔹 Envoie une notification après la candidature
    await this.sendApplicationNotification(application.email);
  }

  /**
   * 📌 Récupère toutes les candidatures pour une mission donnée.
   * @param missionId Identifiant unique de la mission.
   * @returns Un Observable contenant la liste des candidatures.
   * @throws Erreur si l'ID est invalide.
   */
  getApplicationsForMission(missionId: string): Observable<any[]> {
    if (!missionId || missionId.trim() === '') {
      throw new Error('missionId est requis pour accéder aux candidatures.');
    }

    return this.firestore.collection(`missions/${missionId}/applications`)
      .valueChanges({ idField: 'id' }) as Observable<any[]>;
  }

  /**
   * 📌 Envoie une notification via Firebase Cloud Messaging (FCM).
   * La notification est envoyée aux administrateurs pour les informer d'une nouvelle candidature.
   * @param email Email du candidat qui a postulé.
   */
  async sendApplicationNotification(email: string) {
    const notificationPayload = {
      to: '/topics/applications',  // 🔥 Sujet pour notifier tous les administrateurs
      notification: {
        title: 'Nouvelle Candidature',
        body: `Un utilisateur avec l'email ${email} a postulé à une mission.`,
        click_action: 'FLUTTER_NOTIFICATION_CLICK' // 🔹 Action déclenchée sur mobile
      }
    };

    try {
      await this.http.post(
        'https://fcm.googleapis.com/fcm/send', // 🔥 URL Firebase Cloud Messaging
        notificationPayload,
        {
          headers: {
            'Content-Type': 'application/json', // 📌 Format JSON pour la requête
            'Authorization': `key=${environment.firebase.serverKey}` // 🔑 Clé serveur Firebase
          }
        }
      ).toPromise();
      console.log('✅ Notification envoyée avec succès.');
    } catch (error) {
      console.error('❌ Erreur lors de l’envoi de la notification FCM:', error);
    }
  }
}
