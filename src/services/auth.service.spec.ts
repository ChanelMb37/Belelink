import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let mockAngularFireAuth: any;
  let mockFirestore: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAngularFireAuth = {
      authState: of(null),
      signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword').and.returnValue(Promise.resolve()),
      createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword').and.returnValue(Promise.resolve()),
      signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve())
    };

    mockFirestore = {
      collection: jasmine.createSpy('collection').and.returnValue({
        valueChanges: () => of([]),
        doc: jasmine.createSpy('doc').and.returnValue({
          valueChanges: () => of(null),
          set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
        })
      })
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      imports: [
        // Ajout de HttpClientTestingModule pour les requêtes HTTP
        HttpClientTestingModule,
        // Initialisation du module Firebase (Mock)
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: AngularFirestore, useValue: mockFirestore },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call signInWithEmailAndPassword on login', async () => {
    await service.login('test@example.com', 'password123');
    expect(mockAngularFireAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should call signOut on logout', async () => {
    await service.logout();
    expect(mockAngularFireAuth.signOut).toHaveBeenCalled();
  });
});
