import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';  // Stocke l'email de l'utilisateur
  password: string = '';  // Stocke le mot de passe
  showPassword: boolean = false; // Permet de basculer l'affichage du mot de passe
  errorMessage: string = ''; // Message d'erreur à afficher en cas d'échec

  constructor(private authService: AuthService, private router: Router) {}

  // 🔄 Méthode pour basculer la visibilité du mot de passe
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔑 Méthode pour se connecter avec email et mot de passe
  login() {
    // Vérification de l'email avant d'appeler le service de connexion
    if (!this.email || !this.isValidEmail(this.email)) {
      this.errorMessage = "⚠️ Email invalide.";
      return;
    }

    this.authService.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/']);  // Redirige vers l'accueil après connexion
      })
      .catch(error => {
        console.error('Erreur de connexion:', error);
        this.handleError(error); // Gérer les erreurs spécifiques
      });
  }

  // 🔑 Méthode pour se connecter avec Google
  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error('Erreur de connexion avec Google:', error);
      });
  }

  // 📌 Vérifie si l'email est valide
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 📌 Gère les erreurs de connexion et affiche un message approprié
  handleError(error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
        this.errorMessage = "⚠️ Aucun utilisateur trouvé avec cet email.";
        break;
      case 'auth/wrong-password':
        this.errorMessage = "⚠️ Mot de passe incorrect.";
        break;
      case 'auth/invalid-email':
        this.errorMessage = "⚠️ Email invalide.";
        break;
      default:
        this.errorMessage = "⚠️ Une erreur est survenue.";
    }
  }
}
