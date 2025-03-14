import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionsComponent } from './missions.component';
import { MissionService } from '../../services/mission.service';
import { AuthService } from 'src/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('MissionsComponent', () => {
  let component: MissionsComponent;
  let fixture: ComponentFixture<MissionsComponent>;
  let mockMissionService: any;
  let mockAuthService: any;
  let mockFirestore: any;

  beforeEach(() => {
    mockMissionService = {
      getMissions: jasmine.createSpy('getMissions').and.returnValue(of([])), // Simule la récupération des missions
    };

    mockFirestore = {
      collection: jasmine.createSpy('collection').and.returnValue({
        valueChanges: () => of([]),
      }),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Simule le Router pour éviter les erreurs liées aux routes
      declarations: [MissionsComponent],
      providers: [
        { provide: MissionService, useValue: mockMissionService },
        { provide: AuthService, useValue: { user$: of(null) } }, // Simule un utilisateur déconnecté
        { provide: AngularFirestore, useValue: mockFirestore }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch missions on init', () => {
    component.ngOnInit();
    expect(mockMissionService.getMissions).toHaveBeenCalled();
  });

  it('should have an observable for missions', () => {
    expect(component.missions).toBeDefined();
  });
});
