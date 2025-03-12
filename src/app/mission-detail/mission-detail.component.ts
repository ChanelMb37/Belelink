import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mission, MissionService } from '../../services/mission.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mission-detail',
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.css']
})
export class MissionDetailComponent implements OnInit {
  mission: Mission | undefined;
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private missionService: MissionService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupération de l'ID de la mission depuis l'URL
    const missionId = this.route.snapshot.paramMap.get('id');
    if (missionId) {
      this.missionService.getMissionById(missionId).subscribe(mission => {
        this.mission = mission;
      });
    }

    // S'abonner aux données Firestore de l'utilisateur pour vérifier son rôle
    this.authService.user$.subscribe(userData => {
      this.isAdmin = this.authService.isAdmin(userData);
    });
  }

  /**
   * Redirige vers la page de candidature pour la mission.
   */
  apply(): void {
    if (this.mission?.id) {
      this.router.navigate(['/mission', this.mission.id, 'apply']);
    }
  }

  /**
   * Redirige vers la page d'édition de la mission (accessible aux admins).
   */
  editMission(): void {
    if (this.mission?.id) {
      this.router.navigate(['/create-mission', this.mission.id], { queryParams: { mode: 'edit' } });
    }
  }
  
  

  /**
   * Supprime la mission après confirmation (accessible aux admins).
   */
  deleteMission(): void {
    if (this.mission?.id && confirm('Voulez-vous vraiment supprimer cette mission ?')) {
      this.missionService.deleteMission(this.mission.id).then(() => {
        this.router.navigate(['/missions']);
      });
    }
  }
}
