// 📌 Importation des modules nécessaires
import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'; // ✅ Interface CanActivate pour bloquer l'accès si non authentifié
import { AuthService } from '../services/auth.service'; // ✅ Service d'authentification
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // ✅ Permet d'injecter ce guard dans toute l'application
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService, // ✅ Service pour récupérer l'utilisateur connecté
    private router: Router // ✅ Service de navigation
  ) {}

  /**
   * 📌 Vérifie si l'utilisateur est connecté avant d'accéder à une route protégée.
   * Si l'utilisateur est connecté, il peut accéder à la page.
   * Sinon, il est redirigé vers la page de connexion.
   */
  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        if (user) {
          return true; // ✅ Autorise l'accès à la route
        } else {
          this.router.navigate(['/login']); // 🚫 Redirection vers la connexion si non connecté
          return false; // ❌ Bloque l'accès à la route
        }
      })
    );
  }
}
