// Importation des modules nécessaires depuis Angular et Firebase
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

  constructor(private authService: AuthService, private router: Router) {}

  // 🔄 Méthode pour basculer la visibilité du mot de passe
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔑 Méthode pour se connecter avec email et mot de passe
  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/']);  // Redirige vers l'accueil après connexion
      })
      .catch(error => {
        console.error('Erreur de connexion:', error);
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
}
