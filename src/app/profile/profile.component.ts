// 📌 Importation des modules nécessaires
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // 🔹 Service pour gérer l'authentification
import { AngularFirestore } from '@angular/fire/compat/firestore'; // 🔹 Firestore pour stocker les données utilisateur

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null; // 📌 Stocke les informations de l'utilisateur connecté
  displayName: string = ''; // ✅ Nom affiché de l'utilisateur
  photoURL: string = ''; // ✅ URL de la photo de profil
  selectedFile: File | null = null; // 📌 Fichier sélectionné pour la mise à jour de l'avatar

  constructor(
    private authService: AuthService, // ✅ Injection du service d'authentification
    private firestore: AngularFirestore // ✅ Firestore pour récupérer et mettre à jour les données utilisateur
  ) {}

  ngOnInit(): void {
    // 🔹 Abonnement à l'utilisateur connecté
    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (user) {
        // 🔹 Récupération des informations du profil depuis Firestore
        this.firestore
          .doc(`users/${user.uid}`) // 📌 Accès au document de l'utilisateur
          .valueChanges()
          .subscribe((data: any) => {
            // ✅ Mise à jour des champs avec les données récupérées
            this.displayName = data ? data['displayName'] || '' : '';
            this.photoURL = data ? data['photoURL'] || '' : '';
          });
      }
    });
  }

  /**
   * 📌 Gère la sélection d'un fichier.
   * Permet de stocker l'image sélectionnée pour une mise à jour ultérieure.
   */
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]; // ✅ Stocke le fichier sélectionné
  }

  /**
   * 📌 Met à jour les informations du profil utilisateur dans Firestore.
   */
  updateProfile(): void {
    if (this.user) {
      this.firestore
        .doc(`users/${this.user.uid}`) // 📌 Référence au document Firestore de l'utilisateur
        .update({
          displayName: this.displayName, // 🔄 Mise à jour du nom affiché
          photoURL: this.photoURL, // 🔄 Mise à jour de la photo de profil
        })
        .then(() => {
          alert('✅ Profil mis à jour avec succès !'); // 🚀 Notification de succès
        })
        .catch((error) => {
          console.error('❌ Erreur lors de la mise à jour du profil:', error); // 🚨 Gestion des erreurs
        });
    }
  }
}
