import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
      loginWithGoogle: jasmine.createSpy('loginWithGoogle').and.returnValue(Promise.resolve())
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule], // ✅ Ajout du FormsModule pour gérer ngModel
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login on login', async () => {
    component.email = 'test@example.com';
    component.password = 'password123';

    await component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call AuthService.loginWithGoogle on Google login', async () => {
    await component.loginWithGoogle();
    expect(authServiceMock.loginWithGoogle).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
