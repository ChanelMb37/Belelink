import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { AdminGuard } from './admin.guard';
import { AuthService } from 'src/services/auth.service';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => {
        const authService = TestBed.inject(AuthService);
        const router = TestBed.inject(Router);
        const guard = new AdminGuard(authService, router);
        return guard.canActivate(guardParameters[0]);
      });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
