import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let mockFirestore: any;

  beforeEach(() => {
    mockFirestore = {
      collection: jasmine.createSpy('collection').and.returnValue({
        valueChanges: () => of([]),
        add: jasmine.createSpy('add').and.returnValue(Promise.resolve()),
      })
    };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AngularFirestore, useValue: mockFirestore }
      ]
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', (done) => {
    service.getUsers().subscribe(users => {
      expect(users).toEqual([]);
      done();
    });
  });
});
