import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionDetailComponent } from './mission-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MissionService } from 'src/services/mission.service';
import { AuthService } from 'src/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterTestingModule } from '@angular/router/testing';

describe('MissionDetailComponent', () => {
  let component: MissionDetailComponent;
  let fixture: ComponentFixture<MissionDetailComponent>;
  let mockAuthService: any;
  let mockMissionService: any;
  let mockActivatedRoute: any;
  let mockFirestore: any;

  beforeEach(() => {
    // Mock de AuthService
    const mockAuthService = {
      user$: of({ role: 'admin' }) // Simule un utilisateur admin
    };

    // Mock de MissionService
    mockMissionService = {
      getMissionById: jasmine.createSpy('getMissionById').and.returnValue(of(null)),
    };

    // Mock de AngularFirestore
    mockFirestore = {
      collection: jasmine.createSpy('collection').and.returnValue({
        doc: jasmine.createSpy('doc').and.returnValue({
          valueChanges: () => of(null),
          set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
        }),
      }),
    };

    // Mock ActivatedRoute avec un ID fictif
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => 'testMissionId' } }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MissionDetailComponent],
      providers: [
        { provide: MissionService, useValue: mockMissionService },
        { provide: AngularFirestore, useValue: mockFirestore },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    fixture = TestBed.createComponent(MissionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch mission details on init', () => {
    expect(mockMissionService.getMissionById).toHaveBeenCalled();
  });
});
