import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { auhGuard } from './auth.guard';

describe('auhGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => auhGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
