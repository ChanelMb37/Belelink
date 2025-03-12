import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navItems = [
    { label: 'Accueil', link: '/', icon: 'bi-house' },
    { label: 'Missions', link: '/mission', icon: 'bi-briefcase' },
    { label: 'À propos', link: '/about', icon: 'bi-info-circle' },
    { label: 'Contact', link: '/contact', icon: 'bi-envelope' },
    { label: '', link: '/profile', icon: 'bi-person-circle' }
  ];

  isAdmin: boolean = false; // Définir une variable pour stocker l'état admin

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isAdmin = user?.role === 'admin'; // Vérifier si l'utilisateur est admin
    });
  }
}
