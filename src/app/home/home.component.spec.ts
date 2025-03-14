import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    // Mock du service AuthService
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockAuthService = {
      user$: of(null) // Simule un utilisateur non connecté
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }, // ✅ Correction ici
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAuthenticated to false if user is not logged in', () => {
    component.ngOnInit();
    expect(component.isAuthenticated).toBeFalse(); // ✅ Correction ici
  });

  it('should navigate to /dashboard if user is admin', () => {
    mockAuthService.user$ = of({ email: 'admin@example.com' }); // Simule un admin
    fixture.detectChanges();

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set isAuthenticated to true when user is logged in', (done) => {
    mockAuthService.user$ = of({ email: 'user@example.com' });

    component.ngOnInit();
    mockAuthService.user$.subscribe((user: any) => {

      expect(component.isAuthenticated).toBeTrue(); // ✅ Correction ici
      done();
    });
  });

  it('should not display "Rejoignez Nous maintenant" button when user is logged in', () => {
    component.isAuthenticated = true; // ✅ Correction ici
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.btn.btn-primary')).toBeFalsy();
  });

  it('should show "Rejoignez Nous maintenant" button when user is not logged in', () => {
    component.isAuthenticated = false; // ✅ Correction ici
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.btn.btn-primary');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Rejoignez Nous maintenant');
  });
});
