import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from 'src/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: any;
  let mockAngularFireAuth: any;
  let mockFirestore: any;

  beforeEach(async () => {
    // 🔹 Mock Firebase Authentication
    mockAngularFireAuth = {
      authState: of({ uid: '12345' }) // Simule un utilisateur connecté
    };

    // 🔹 Mock Firestore (si nécessaire)
    mockFirestore = {
      collection: jasmine.createSpy('collection').and.returnValue({
        valueChanges: () => of([])
      })
    };

    // Mock AuthService
    authServiceMock = {
      user$: of({ role: 'admin' }) // Simule un administrateur
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Permet d'éviter les erreurs liées à routerLink
      declarations: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: AngularFirestore, useValue: mockFirestore }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAdmin to true for admin users', () => {
    expect(component.isAdmin).toBeTrue();
  });

  it('should add "Nouvelle mission" to navItems if user is admin', () => {
    expect(component.navItems.some(item => item.label === 'Nouvelle mission')).toBeTrue();
  });

  it('should not add "Nouvelle mission" if user is not admin', () => {
    authServiceMock.user$ = of({ role: 'user' }); // Simule un utilisateur non admin
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.navItems.some(item => item.label === 'Nouvelle mission')).toBeFalse();
  });
});
