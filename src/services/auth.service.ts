import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root' // 🔥 Permet d'injecter ce service dans toute l'application
})
export class AuthService {
  user$: Observable<any>; // 🔍 Observable qui contient l'utilisateur connecté

  constructor(
    private afAuth: AngularFireAuth, // 🔥 Gestion de l'authentification avec Firebase
    private firestore: AngularFirestore, // 🔥 Accès à la base de données Firestore
    private router: Router // 🚀 Pour rediriger l'utilisateur après certaines actions
  ) {
    // 🎯 Récupérer l'état de l'utilisateur et ses informations depuis Firestore
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => user ? this.firestore.doc(`users/${user.uid}`).valueChanges() : of(null))
    );
  }

  /**
   * 🔑 Récupère l'utilisateur actuellement connecté.
   * @returns Une promesse contenant l'utilisateur Firebase ou `null` s'il n'est pas connecté.
   */
  getCurrentUser(): Promise<firebase.User | null> {
    return this.afAuth.currentUser;
  }

  /**
   * 🔐 Récupère le token Firebase de l'utilisateur connecté.
   * @returns Une promesse contenant le token d'authentification.
   */
  async getToken(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.getIdToken() : null;
  }

  /**
   * 📝 Inscription et enregistrement de l'utilisateur dans Firestore.
   * @param email L'adresse email de l'utilisateur.
   * @param password Le mot de passe (au moins 6 caractères).
   */
  async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        // Envoyer un email de vérification
        await user.sendEmailVerification();
  
        // Ajouter l'utilisateur à Firestore
        await this.addUserToFirestore(user, 'user');
  
        // Déconnexion immédiate pour forcer l'utilisateur à confirmer son email
        await this.afAuth.signOut();
  
        // Redirection vers la page de connexion avec un message
        this.router.navigate(['/login'], { queryParams: { verifyEmail: true } });
      }
    } catch (error) {
      console.error('❌ Erreur lors de l’inscription:', error);
      throw error;
    }
  }
  

  /**
   * 🔑 Connexion avec email et mot de passe.
   * @param email L'adresse email de l'utilisateur.
   * @param password Le mot de passe de l'utilisateur.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/dashboard']); // 🚀 Redirection après connexion
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      throw error;
    }
  }

  /**
   * 🔑 Connexion avec un compte Google.
   */
  /**
 * 🔑 Connexion avec un compte Google.
 * Cette méthode permet à un utilisateur de se connecter via Google en utilisant Firebase Authentication.
 */
async loginWithGoogle(): Promise<void> {
  try {
    // 1️⃣ Création d'un fournisseur d'authentification Google
    const provider = new firebase.auth.GoogleAuthProvider();

    // 2️⃣ Affiche une fenêtre pop-up pour que l'utilisateur sélectionne son compte Google
    const userCredential = await this.afAuth.signInWithPopup(provider);

    // 3️⃣ Récupération des informations de l'utilisateur connecté
    const user = userCredential.user;

    if (user) {
      // 4️⃣ Ajout ou mise à jour des informations de l'utilisateur dans Firestore
      //    - user : l'utilisateur Firebase
      //    - 'user' : rôle par défaut (peut être modifié plus tard)
      //    - true : indique que c'est une connexion via Google
      await this.addUserToFirestore(user, 'user', true); 

      // 5️⃣ Redirection vers le tableau de bord après connexion réussie
      this.router.navigate(['/dashboard']); 
    }
  } catch (error) {
    // 6️⃣ Gestion des erreurs en cas de problème lors de la connexion
    console.error('❌ Erreur lors de la connexion Google:', error);
    throw error; // Relance l'erreur pour permettre son traitement ailleurs si nécessaire
  }
}

  /**
   * 🚪 Déconnexion de l'utilisateur.
   */
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/']); // ✅ Redirection vers la page d'accueil après déconnexion
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  /**
   * 🔍 Ajoute ou met à jour un utilisateur dans Firestore.
   * @param user L'utilisateur Firebase.
   * @param role Le rôle de l'utilisateur (par défaut "user").
   * @param isGoogleLogin Indique si l'inscription provient de Google.
   */
  private async addUserToFirestore(user: firebase.User, role: string = 'user', isGoogleLogin: boolean = false): Promise<void> {
    const userRef = this.firestore.doc(`users/${user.uid}`);

    try {
      await userRef.set({
        uid: user.uid,
        email: user.email,
        displayName: isGoogleLogin ? user.displayName : (user.email ? user.email.split('@')[0] : 'Utilisateur inconnu'),
        createdAt: new Date(),
        role: role
      }, { merge: true }); // ✅ Empêche l'écrasement des données existantes
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de l'utilisateur à Firestore:", error);
      throw error;
    }
  }

  /**
   * ✅ Vérifie si l'utilisateur est connecté.
   * @returns Un `Observable<boolean>` qui indique si l'utilisateur est connecté ou non.
   */
  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => !!user)); // ✅ Retourne `true` si connecté, sinon `false`
  }

  /**
   * 🔄 Met à jour le profil utilisateur (nom et photo).
   * @param displayName Le nouveau nom d'affichage.
   * @param photoURL La nouvelle URL de la photo de profil.
   */
  async updateProfile(displayName: string, photoURL: string): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      await user.updateProfile({ displayName, photoURL });
      await this.firestore.doc(`users/${user.uid}`).update({ displayName, photoURL });
    }
  }

  /**
   * 🏆 Vérifie si l'utilisateur est un administrateur.
   * @param user L'objet utilisateur provenant de Firestore.
   * @returns `true` si l'utilisateur est administrateur, `false` sinon.
   */
  isAdmin(user: any): boolean {
    return user?.role === 'admin';
  }

  /**
   * 📌 Vérifie si l'utilisateur est un organisateur.
   * @param user L'objet utilisateur provenant de Firestore.
   * @returns `true` si l'utilisateur est organisateur, `false` sinon.
   */
  isOrganisateur(user: any): boolean {
    return user?.role === 'organisateur';
  }

  /**
   * 🤝 Vérifie si l'utilisateur est un bénévole.
   * @param user L'objet utilisateur provenant de Firestore.
   * @returns `true` si l'utilisateur est bénévole, `false` sinon.
   */
  isBenevole(user: any): boolean {
    return user?.role === 'benevole';
  }
}