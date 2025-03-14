// 📌 Importation des modules nécessaires
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from '../../services/mission.service';
import { AuthService } from '../../services/auth.service';
import { MessagingService } from '../../services/messaging.service'; // Service pour gérer les notifications

@Component({
  selector: 'app-mission-apply',
  templateUrl: './mission-apply.component.html',
  styleUrls: ['./mission-apply.component.css']
})
export class MissionApplyComponent implements OnInit {
  
  missionId: string | null = null; // 🔹 ID de la mission récupérée depuis l'URL
  name: string = ''; // 🔹 Nom du candidat
  email: string = ''; // 🔹 Email du candidat
  phone: string = ''; // 🔹 Numéro de téléphone du candidat
  isLoading: boolean = false; // 🔹 Indicateur de chargement (évite le spam des requêtes)
  errorMessage: string = ''; // 🔹 Message d'erreur en cas de problème

  constructor(
    private route: ActivatedRoute, // 📌 Permet de récupérer l'ID de la mission dans l'URL
    private missionService: MissionService, // 📌 Service pour gérer les missions
    private authService: AuthService, // 📌 Service d'authentification
    @Inject(MessagingService) private messagingService: MessagingService, // 📌 Service pour envoyer des notifications via FCM
    private router: Router // 📌 Service pour gérer la navigation
  ) {}

  ngOnInit(): void {
    // 📌 Récupération de l'ID de la mission à partir des paramètres de l'URL
    this.missionId = this.route.snapshot.paramMap.get('id');

    // 📌 Si un utilisateur est connecté, préremplir ses informations (nom & email)
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.name = user.displayName || ''; // 📝 Récupère le nom de l'utilisateur (ou une chaîne vide si non défini)
        this.email = user.email || ''; // 📧 Récupère l'email de l'utilisateur
      }
    });
  }

  /**
   * 📌 Méthode permettant à l'utilisateur de postuler pour une mission.
   */
  async apply(): Promise<void> {
    
    // 🚨 Vérifie que l'ID de la mission est bien défini
    if (!this.missionId) {
      this.errorMessage = "❌ Erreur : ID de mission introuvable !";
      return;
    }

    // 🚨 Vérifie que tous les champs du formulaire sont remplis
    if (!this.name || !this.email || !this.phone) {
      this.errorMessage = "❌ Veuillez remplir tous les champs.";
      return;
    }

    this.isLoading = true; // 🔄 Active l'indicateur de chargement

    try {
      // 📌 Vérifie si l'utilisateur est bien connecté avant d'envoyer la candidature
      const user = await this.authService.getCurrentUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour postuler.");
      }

      // 🔹 Création de l'objet candidature avec les informations de l'utilisateur
      const application = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        dateApplied: new Date(), // 📅 Ajout de la date de candidature
        userId: user.uid // 🔑 Stocke l'ID utilisateur pour éviter les doublons
      };

      // 📌 Envoi de la candidature à Firestore via le service missionService
      await this.missionService.applyToMission(this.missionId!, application);

      alert("✅ Votre candidature a été envoyée avec succès !");

      // 📩 Envoi d'une notification aux administrateurs via Firebase Cloud Messaging (FCM)
      await this.sendAdminNotification(this.missionId!, this.name);

      // 🔄 Redirection vers la liste des missions après soumission
      this.router.navigate(['/missions']);

    } catch (error: any) {
      console.error("❌ Erreur lors de la soumission :", error);
      this.errorMessage = error.message || "❌ Erreur lors de l'envoi de la candidature.";
    } finally {
      this.isLoading = false; // ⏳ Désactive l'indicateur de chargement, peu importe l'issue de la requête
    }
  }

  /**
   * 📌 Envoie une notification aux administrateurs via Firebase Cloud Messaging (FCM).
   * @param missionId Identifiant de la mission.
   * @param applicantName Nom du candidat.
   */
  private async sendAdminNotification(missionId: string, applicantName: string): Promise<void> {
    try {
      // 📩 Envoi d'une notification aux administrateurs via Firebase Cloud Messaging (FCM)
      await this.messagingService.sendNotification({
        title: "Nouvelle candidature",
        body: `${applicantName} a postulé pour la mission ${missionId}.`,
        missionId: missionId
      });
      console.log("📩 Notification envoyée aux administrateurs !");
    } catch (error: any) {
      console.error("❌ Erreur lors de l'envoi de la notification :", error);
    }
  }
}
