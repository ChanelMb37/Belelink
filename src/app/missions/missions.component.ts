import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {

  missions = [
    {
      title: 'Éducation pour tous',
      description: 'Nous nous engageons à fournir des ressources éducatives aux enfants défavorisés. Rejoignez-nous pour faire la différence dans la vie des jeunes.'
    },
    {
      title: 'Santé communautaire',
      description: 'Participez à nos initiatives de santé pour offrir des soins médicaux de base aux communautés isolées. Votre aide peut sauver des vies.'
    },
    {
      title: 'Protection de l\'environnement',
      description: 'Engagez-vous dans nos projets de reboisement et de nettoyage pour préserver notre planète. Chaque petit geste compte.'
    },
    {
      title: 'Aide alimentaire',
      description: 'Aidez-nous à distribuer des repas aux personnes dans le besoin. Ensemble, nous pouvons combattre la faim dans nos communautés.'
    }
  ];

  ngOnInit(): void {
    console.log('MissionsComponent initialisé avec', this.missions);
  }
}
