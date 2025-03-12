import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';  // Import du Guard
import { ProfileComponent } from './profile/profile.component';
import { MissionApplyComponent } from './mission-apply/mission-apply.component';
import { MissionDetailComponent } from './mission-detail/mission-detail.component';
import { MissionListComponent } from './mission-list/mission-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MissionsComponent } from './missions/missions.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CreateMissionComponent } from './create-mission/create-mission.component';
import { AdminGuard } from './guards/admin.guard'; // ✅ Ajoute ceci


const routes: Routes = [
  

  { path: '', component: HomeComponent }, // ✅ Afficher la page d'accueil si non connecté
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] }, // ✅ Protection admin

 
  { path: 'mission', component: MissionsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent }, // Protégé
  { path: 'missions', component: MissionListComponent  },
  // Route pour créer une nouvelle mission
  { path: 'create-mission', component: CreateMissionComponent , canActivate: [AdminGuard] },
  // Route pour modifier une mission (mode édition)
  { path: 'create-mission/:id', component: CreateMissionComponent , canActivate: [AdminGuard]},
  { path: 'mission/:id', component: MissionDetailComponent },
  { path: 'mission/:id/apply', component: MissionApplyComponent, canActivate: [AuthGuard] },
  // { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirige vers la page d'accueil pour les URL incorrectes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
