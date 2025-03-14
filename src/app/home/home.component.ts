// 📌 Importation des modules nécessaires
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';  // ✅ Vérifie que ce chemin est correct !

// 📌 Importation de AOS (Animate On Scroll), une bibliothèque d'animations
import AOS from 'aos';

@Component({
  selector: 'app-home', // 🔹 Définit le sélecteur du composant
  templateUrl: './home.component.html', // 🔹 Associe le fichier HTML du composant
  styleUrls: ['./home.component.css'] // 🔹 Associe le fichier CSS du composant
})
export class HomeComponent implements OnInit {
  
  // 🔹 Liste des fonctionnalités affichées sur la page d'accueil
  features = [
    { icon: 'bi-people', title: 'Rejoignez une communauté', description: 'Connectez-vous avec des bénévoles passionnés.' },
    { icon: 'bi-calendar-check', title: 'Trouvez des missions', description: 'Recherchez et postulez facilement à des missions de bénévolat.' },
    { icon: 'bi-shield-lock', title: 'Sécurisé et fiable', description: 'Vos informations sont protégées avec des technologies modernes.' }
  ];

  isAuthenticated: boolean = false; // 🔹 Indique si l'utilisateur est connecté
  loading: boolean = true; // 🔄 Indicateur de chargement (empêche l'affichage avant d'avoir vérifié l'authentification)

  constructor(
    private authService: AuthService, // 📌 Service d'authentification
    private router: Router // 📌 Service de navigation
  ) {}

  ngOnInit(): void {
    
    // 🚀 Initialise les animations AOS avec une durée de 1000ms
    AOS.init({ duration: 1000 });

    // 🔍 Vérification de l'état de l'utilisateur (abonnement aux changements d'authentification)
    this.authService.user$.subscribe((user: any) => {

      this.loading = false; // ✅ Désactive le mode chargement après récupération des infos utilisateur

      if (user) {
        this.isAuthenticated = true; // ✅ L'utilisateur est connecté

        // 🔹 Vérifie si l'utilisateur est administrateur et redirige vers le tableau de bord
        if (this.authService.isAdmin(user)) { 
          console.log('🔄 Administrateur détecté, redirection vers /dashboard');
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.isAuthenticated = false; // ❌ L'utilisateur n'est pas connecté
      }
    });
  }
}
