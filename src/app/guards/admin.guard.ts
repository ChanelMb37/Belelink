// 📌 Importation des modules nécessaires
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service'; // ✅ Vérifie le chemin d'importation !
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // 🔹 Rend ce service accessible à toute l'application
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * 📌 Vérifie si l'utilisateur est administrateur avant d'accéder à une route protégée.
   * @returns {Observable<boolean>} Renvoie `true` si l'utilisateur est admin, sinon redirige vers l'accueil.
   */
  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        if (user && user.role === 'admin') { // ✅ Vérifie si l'utilisateur est connecté et a le rôle "admin"
          return true; // 🔓 Autorise l'accès
        } else {
          this.router.navigate(['/']); // ❌ Redirige vers la page d'accueil si l'utilisateur n'est pas admin
          return false; // 🔒 Bloque l'accès
        }
      })
    );
  }
}
