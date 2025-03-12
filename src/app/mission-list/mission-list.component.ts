import { Component, OnInit } from '@angular/core';
import { Mission, MissionService } from '../../services/mission.service';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnInit {
  // Tableau de toutes les missions récupérées depuis Firestore
  missions: Mission[] = [];
  
  // Terme de recherche saisi par l'utilisateur
  searchTerm: string = '';
  
  // Champ sélectionné pour le filtrage : "title" (Nom) ou "location" (Lieu)
  selectedField: 'title' | 'location' = 'title';

  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    // Récupération des missions depuis Firestore
    this.missionService.getMissions().subscribe(missions => {
      this.missions = missions;
    });
  }

  /**
   * Propriété calculée qui retourne les missions filtrées
   * en fonction du terme de recherche et du champ sélectionné.
   */
/**
 * 🔍 Propriété calculée qui retourne la liste des missions filtrées
 * en fonction du terme de recherche et du champ sélectionné.
 */
get filteredMissions(): Mission[] {
  
  // 📌 Vérifie si le champ de recherche est vide ou ne contient que des espaces.
  // Si c'est le cas, retourne la liste complète des missions.
  if (!this.searchTerm.trim()) {
    return this.missions;
  }

  // 🔽 Normalisation du terme de recherche : suppression des accents et conversion en minuscules
  const term = this.removeAccents(this.searchTerm.toLowerCase());

  // 🔎 Filtrage des missions en fonction du champ sélectionné (titre ou localisation)
  return this.missions.filter(mission => {

    // 📌 Si l'utilisateur filtre par titre, vérifie si le titre normalisé contient le terme recherché
    if (this.selectedField === 'title') {
      return this.removeAccents(mission.title.toLowerCase()).includes(term);
    
    // 📌 Si l'utilisateur filtre par localisation, vérifie si la localisation normalisée contient le terme recherché
    } else if (this.selectedField === 'location') {
      return mission.location ? this.removeAccents(mission.location.toLowerCase()).includes(term) : false;
    }

    // ❌ Si aucun champ valide n'est sélectionné, ne filtre pas l'élément
    return false;
  });
}

  /**
   * 🔍 Supprime les accents des chaînes de caractères pour une meilleure correspondance
   * @param str La chaîne à normaliser
   * @returns La chaîne sans accents
   */
  private removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  /**
   * Réinitialise le terme de recherche.
   */
  clearSearch(): void {
    this.searchTerm = '';
  }

  /**
   * (Optionnel) Méthode déclenchée lors du changement de sélection,
   * si des actions spécifiques sont nécessaires.
   */
  applyFilter(): void {
    // Ici, le getter filteredMissions se met à jour automatiquement.
    // Vous pouvez ajouter d'autres actions si besoin.
  }
}
