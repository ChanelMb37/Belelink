import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { MissionService } from '../../services/mission.service'; 
import { UserService } from '../../services/user.service'; 
import { Observable } from 'rxjs';
import { Chart, registerables } from 'chart.js'; 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // ✅ Variables pour stocker les statistiques
  totalUsers: number = 0;
  totalMissions: number = 0; 
  totalApplications: number = 0; 
  missions$!: Observable<any[]>; 
  missionChart: any; 

  constructor(
    private missionService: MissionService, 
    private userService: UserService, 
    private router: Router 
  ) {
    Chart.register(...registerables); 
  }

  ngOnInit(): void {
    // 📌 Récupération des missions et calcul des statistiques associées
    this.missions$ = this.missionService.getMissions();
    this.missions$.subscribe(missions => {
      this.totalMissions = missions.length; // 🔢 Stocke le nombre total de missions
      this.totalApplications = missions.reduce((sum, mission) => sum + (mission.applicationsCount || 0), 0); // 📌 Somme des candidatures sur toutes les missions
      this.generateMissionChart(); // 📊 Génération du graphique des missions
    });

    // 📌 Récupération du nombre total d'utilisateurs
    this.userService.getUsers().subscribe(users => {
      this.totalUsers = users.length;
    });
  }

  /**
   * ✅ Méthode pour naviguer vers une page spécifique du tableau de bord.
   * @param page Nom de la page vers laquelle naviguer.
   */
  navigateTo(page: string): void {
    this.router.navigate([`dashboard/${page}`]); // 🔄 Redirection vers la page demandée
  }

  /**
   * 📊 Génère un graphique représentant le nombre de missions et de candidatures.
   */
  generateMissionChart(): void {
    // 🔄 Vérifie si un graphique existe déjà et le détruit avant d'en créer un nouveau
    if (this.missionChart) {
      this.missionChart.destroy();
    }

    // 📌 Récupère l'élément canvas du DOM
    const ctx = document.getElementById('missionChart') as HTMLCanvasElement;
    if (!ctx) return; // 🔄 Vérifie si l'élément existe avant de créer le graphique

    // 📊 Création du graphique en barres avec Chart.js
    this.missionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Missions', 'Candidatures'], // 📍 Catégories affichées
        datasets: [{
          label: 'Statistiques', // 🔹 Titre du dataset
          data: [this.totalMissions, this.totalApplications], // 🔢 Données des statistiques
          backgroundColor: ['#4CAF50', '#FF5733'] // 🎨 Couleurs des barres
        }]
      }
    });
  }
}
