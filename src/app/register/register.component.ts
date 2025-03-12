// 📌 Importation des modules nécessaires
import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // ✅ Service pour gérer l'authentification
import { Router } from '@angular/router'; // ✅ Service pour gérer la navigation

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = ''; // ✅ Stocke l'email saisi par l'utilisateur
  password: string = ''; // ✅ Stocke le mot de passe saisi
  errorMessage: string = ''; // 📌 Message d'erreur à afficher en cas d'échec
  showPassword: boolean = false; // 📌 Permet d'afficher ou masquer le mot de passe

  constructor(
    private authService: AuthService, // ✅ Injection du service d'authentification
    @Inject(Router) private router: Router // ✅ Injection du service de navigation
  ) {}

  /**
   * 📌 Gère l'inscription d'un nouvel utilisateur.
   */
  register() {
    // 🔹 Vérifie si le mot de passe respecte la longueur minimale
    if (this.password.length < 6) {
      this.errorMessage = "❌ Le mot de passe doit contenir au moins 6 caractères.";
      return; // 🚫 Stoppe l'exécution si le mot de passe est trop court
    }

    // 🔹 Appel du service d'inscription
    this.authService.register(this.email, this.password)
      .then(() => {
        this.router.navigate(['/']); // 🚀 Redirection vers l'accueil après l'inscription réussie
      })
      .catch(error => {
        this.handleError(error); // 📌 Gestion des erreurs Firebase
      });
  }

  /**
   * 📌 Gère les erreurs d'inscription et affiche un message approprié.
   */
  handleError(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.errorMessage = "⚠️ Cet email est déjà utilisé.";
        break;
      case 'auth/invalid-email':
        this.errorMessage = "⚠️ Email invalide.";
        break;
      case 'auth/weak-password':
        this.errorMessage = "⚠️ Mot de passe trop faible (min 6 caractères).";
        break;
      default:
        this.errorMessage = "⚠️ Une erreur est survenue.";
    }
  }

  /**
   * 📌 Bascule la visibilité du mot de passe.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // 🔄 Inversion de l'état
  }
}
