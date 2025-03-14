import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    // 🔹 Mock du service d'authentification
    mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue(Promise.resolve()),
    };

    // 🔹 Mock du service de navigation
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not register if password is too short', () => {
    component.email = 'test@example.com';
    component.password = '123'; // Trop court
    component.register();
    expect(component.errorMessage).toBe("❌ Le mot de passe doit contenir au moins 6 caractères.");
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('should call AuthService register method when form is valid', async () => {
    component.email = 'test@example.com';
    component.password = 'ValidPass123';
    await component.register();
    expect(mockAuthService.register).toHaveBeenCalledWith('test@example.com', 'ValidPass123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle errors from AuthService', async () => {
    mockAuthService.register.and.returnValue(Promise.reject({ code: 'auth/email-already-in-use' }));
    component.email = 'test@example.com';
    component.password = 'ValidPass123';
    await component.register();
    expect(component.errorMessage).toBe("⚠️ Cet email est déjà utilisé.");
  });
});
