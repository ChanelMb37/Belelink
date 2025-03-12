// 📌 Importation des modules nécessaires
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // ✅ Permet de récupérer des paramètres d'URL et de naviguer
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // 📌 Gestion des formulaires
import { MissionService } from '../../services/mission.service'; // 🔹 Service pour gérer les missions
import { AuthService } from 'src/services/auth.service'; // 🔹 Service pour gérer l'authentification

@Component({
  selector: 'app-create-mission',
  templateUrl: './create-mission.component.html',
  styleUrls: ['./create-mission.component.css']
})
export class CreateMissionComponent implements OnInit {
  
  missionForm: FormGroup; // 📌 Formulaire de création/édition de mission
  isEditMode: boolean = false; // ✅ Indique si on est en mode édition
  missionId: string | null = null; // 📌 ID de la mission en cours de modification
  isAdmin: boolean = false; // ✅ Vérifie si l'utilisateur est administrateur

  constructor(
    private fb: FormBuilder, // 📌 Gestion des formulaires
    private missionService: MissionService, // 🔹 Service des missions
    private authService: AuthService, // 🔹 Service d'authentification
    private route: ActivatedRoute, // ✅ Récupération des paramètres d'URL
    private router: Router // ✅ Permet la navigation entre les pages
  ) {
    // 📌 Initialisation du formulaire avec des validations
    this.missionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: [''] // 🔄 Champ facultatif
    });
  }

  ngOnInit(): void {
    // ✅ Vérifier si l'utilisateur connecté est administrateur
    this.authService.user$.subscribe(user => {
      if (user && user.role === 'admin') {
        this.isAdmin = true;
      } else {
        this.router.navigate(['/']); // 🚫 Redirection vers l'accueil si l'utilisateur n'est pas admin
      }
    });

    // 📌 Récupérer l'ID de la mission depuis l'URL
    this.missionId = this.route.snapshot.paramMap.get('id');

    // 📌 Vérifier le mode via queryParam
    const mode = this.route.snapshot.queryParamMap.get('mode');
    if (mode === 'edit' && this.missionId) {
      this.isEditMode = true; // ✅ Active le mode édition
      // 📌 Charger les informations de la mission pour modification
      this.missionService.getMissionById(this.missionId).subscribe(mission => {
        if (mission) {
          this.missionForm.patchValue({
            title: mission.title,
            description: mission.description,
            date: mission.date,
            location: mission.location
          });
        }
      });
    }
  }

  /**
   * 📌 Gère la soumission du formulaire.
   * En mode édition, met à jour la mission ; sinon, crée une nouvelle mission.
   */
  onSubmit(): void {
    if (this.missionForm.invalid) {
      return; // 🚫 Empêche l'envoi si le formulaire est invalide
    }

    if (this.isEditMode && this.missionId) {
      // ✅ Mettre à jour la mission existante
      this.missionService.updateMission(this.missionId, this.missionForm.value)
        .then(() => this.router.navigate(['/missions'])) // 🔄 Redirection après modification
        .catch(err => console.error('❌ Erreur lors de la mise à jour :', err));
    } else {
      // ✅ Créer une nouvelle mission
      this.missionService.createMission(this.missionForm.value)
        .then(() => this.router.navigate(['/missions'])) // 🔄 Redirection après création
        .catch(err => console.error('❌ Erreur lors de la création :', err));
    }
  }
}
