import { TestBed } from '@angular/core/testing';
import { MissionService } from './mission.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/services/auth.service';
import { of } from 'rxjs';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

// Mock de AngularFirestore
const collectionStub = {
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of([])),
  add: jasmine.createSpy('add').and.returnValue(Promise.resolve({ id: 'mockMissionId' })),
  doc: jasmine.createSpy('doc').and.returnValue({
    valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of(null)),
    update: jasmine.createSpy('update').and.returnValue(Promise.resolve()),
    delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve())
  })
};

const mockFirestore = {
  collection: jasmine.createSpy('collection').and.returnValue(collectionStub)
};

// Mock de AuthService
const mockAuthService = {
  user$: of({ role: 'admin' }) // Simule un utilisateur administrateur
};

describe('MissionService', () => {
  let service: MissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(environment.firebase)],
      providers: [
        MissionService,
        { provide: AngularFirestore, useValue: mockFirestore },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(MissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch missions as an observable', (done) => {
    service.getMissions().subscribe(missions => {
      expect(mockFirestore.collection).toHaveBeenCalledWith('missions');
      expect(collectionStub.valueChanges).toHaveBeenCalled();
      expect(missions).toEqual([]);
      done();
    });
  });

  it('should create a new mission', async () => {
    const missionData = { title: 'Test Mission', description: '', date: new Date(), organiserId: '' };
    await service.createMission(missionData);
    expect(mockFirestore.collection).toHaveBeenCalledWith('missions');
    expect(collectionStub.add).toHaveBeenCalledWith(missionData);
  });

  it('should delete a mission', async () => {
    await service.deleteMission('testMissionId');
    expect(mockFirestore.collection).toHaveBeenCalledWith('missions');
    expect(collectionStub.doc).toHaveBeenCalledWith('testMissionId');
    expect(collectionStub.doc().delete).toHaveBeenCalled();
  });

  it('should update a mission', async () => {
    const missionData = { title: 'Updated Mission', description: 'Updated description', date: new Date(), organiserId: '' };
    await service.updateMission('testMissionId', missionData);
    expect(mockFirestore.collection).toHaveBeenCalledWith('missions');
    expect(collectionStub.doc).toHaveBeenCalledWith('testMissionId');
    expect(collectionStub.doc().update).toHaveBeenCalledWith(missionData);
  });
});
