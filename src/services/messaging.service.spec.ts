import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessagingService } from './messaging.service';
import { AuthService } from './auth.service';

describe('MessagingService', () => {
  let service: MessagingService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MessagingService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(MessagingService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a notification when authenticated', (done) => {
    const fakeToken = 'fake-auth-token';
    authServiceMock.getToken.and.returnValue(Promise.resolve(fakeToken));

    const payload = {
      title: 'Test Notification',
      body: 'Ceci est un test',
      missionId: '123'
    };

    service.sendNotification(payload).then(() => {
      const req = httpMock.expectOne('https://us-central1-engagebenevole.cloudfunctions.net/sendNotification');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
      req.flush({ success: true });

      done();
    }).catch(done.fail);
  });

  it('should fail to send notification if user is not authenticated', (done) => {
    authServiceMock.getToken.and.returnValue(Promise.resolve(null));

    const payload = {
      title: 'Test Notification',
      body: 'Ceci est un test',
      missionId: '123'
    };

    service.sendNotification(payload).catch(error => {
      expect(error.message).toBe('Utilisateur non authentifié !');
      done();
    });
  });

});
