import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 📌 Service permettant de gérer les utilisateurs via Firestore.
 */
@Injectable({
  providedIn: 'root' // 🔥 Fournit ce service à toute l'application.
})
export class UserService {
  constructor(private firestore: AngularFirestore) {} // 🔹 Injection de Firestore pour accéder à la base de données.

  /**
   * 📌 Récupère la liste des utilisateurs depuis Firestore.
   * @returns Un Observable contenant un tableau d'objets utilisateurs.
   */
  getUsers(): Observable<any[]> {
    return this.firestore.collection('users') // 🔥 Récupération de la collection "users".
      .snapshotChanges() // 📌 Écoute les modifications en temps réel.
      .pipe(
        map(actions => 
          actions.map(a => {
            const data = a.payload.doc.data() as Record<string, any>; // 🔹 Récupération des données de chaque utilisateur.
            const id = a.payload.doc.id; // 🔹 Récupération de l'identifiant du document.
            return { id, ...data }; // 🔥 Retourne un objet utilisateur avec son ID Firestore.
          })
        )
      );
  }
}
