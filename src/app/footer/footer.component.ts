import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',                
  templateUrl: './footer.component.html', 
  styleUrls: ['./footer.component.css']  
})
export class FooterComponent {
  // Tableau des liens à afficher dans le pied de page avec leur label, URL et icône associée
  footerLinks = [
    { label: 'Mentions légales', link: '#', icon: 'bi-file-earmark-text' },      // Lien pour les mentions légales avec icône
    { label: 'Confidentialité', link: '#', icon: 'bi-shield-lock' },             // Lien pour la politique de confidentialité avec icône
    { label: 'Contact', link: '/contact', icon: 'bi-envelope' }                         // Lien pour la page de contact avec icône
  ];
}
