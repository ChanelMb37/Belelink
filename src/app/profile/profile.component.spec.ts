import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from 'src/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: any;
  let mockFirestore: any;

  beforeEach(async () => {
    // 🔹 Mock du service d'authentification
    mockAuthService = {
      user$: of({
        uid: 'testUserId',
        displayName: 'Test User',
        email: 'test@example.com',
      }),
    };

    // 🔹 Mock de Firestore
    mockFirestore = {
      doc: jasmine.createSpy('doc').and.returnValue({
        valueChanges: jasmine.createSpy('valueChanges').and.returnValue(
          of({
            displayName: 'Test User',
            photoURL: 'https://example.com/test.jpg',
          })
        ),
        update: jasmine.createSpy('update').and.returnValue(Promise.resolve()),
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AngularFirestore, useValue: mockFirestore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(component.user).toEqual({
      uid: 'testUserId',
      displayName: 'Test User',
      email: 'test@example.com',
    });
    expect(component.displayName).toBe('Test User');
    expect(component.photoURL).toBe('https://example.com/test.jpg');
  });

  it('should update profile successfully', async () => {
    component.displayName = 'Updated User';
    component.photoURL = 'https://example.com/updated.jpg';
    await component.updateProfile();
    expect(mockFirestore.doc).toHaveBeenCalledWith('users/testUserId');
    expect(mockFirestore.doc().update).toHaveBeenCalledWith({
      displayName: 'Updated User',
      photoURL: 'https://example.com/updated.jpg',
    });
  });
});
