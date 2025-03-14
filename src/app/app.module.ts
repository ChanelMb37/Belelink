import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Pour ngModel et ReactiveForms
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/services/auth.service';

import { NgChartsModule } from 'ng2-charts'; // Assurez-vous que ng2-charts est bien installé

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// Importation de l'environnement Firebase
import { environment } from 'src/environments/environment';  
import {  MissionsComponent } from './missions/missions.component';
import { MissionListComponent } from './mission-list/mission-list.component';
import { MissionApplyComponent } from './mission-apply/mission-apply.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { MissionDetailComponent } from './mission-detail/mission-detail.component';
import { CreateMissionComponent } from './create-mission/create-mission.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent, // Assurez-vous que NavbarComponent est bien importé ici
    FooterComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    MissionsComponent,
    MissionListComponent,
    MissionDetailComponent,
    MissionApplyComponent,
    DashboardComponent,
    CreateMissionComponent,
    AboutComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule, 
    AppRoutingModule,  // Importation du module de routage
    FormsModule,  // Pour utiliser ngModel
    ReactiveFormsModule,  // Pour utiliser les formulaires réactifs si nécessaire
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot(), 
    NgChartsModule,  // Pour intégrer les graphiques
    // Firebase Initialisation
    AngularFireModule.initializeApp(environment.firebase), // Initialise Firebase en mode compat
    AngularFireAuthModule,
    AngularFirestoreModule,
    
  ],
  providers: [ UserService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
