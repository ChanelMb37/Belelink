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
        await this.addUserToFirestore(user, 'user'); // 🔄 Enregistre l'utilisateur en base
        this.router.navigate(['/dashboard']); // 🚀 Redirection après inscription
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
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      const user = userCredential.user;
      if (user) {
        await this.addUserToFirestore(user, 'user', true); // 🔄 Sauvegarde dans Firestore
        this.router.navigate(['/dashboard']); // 🚀 Redirection après connexion Google
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion Google:', error);
      throw error;
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
