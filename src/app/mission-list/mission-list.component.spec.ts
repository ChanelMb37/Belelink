import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionListComponent } from './mission-list.component';
import { MissionService } from 'src/services/mission.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('MissionListComponent', () => {
  let component: MissionListComponent;
  let fixture: ComponentFixture<MissionListComponent>;
  let mockMissionService: any;
  let mockFirestore: any;

  beforeEach(async () => {
    mockFirestore = {
      collection: jasmine.createSpy('collection').and.returnValue({
        valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of([])),
      })
    };

    const missionServiceMock = {
      getMissions: jasmine.createSpy('getMissions').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      declarations: [MissionListComponent],
      providers: [
        { provide: MissionService, useValue: missionServiceMock },
        { provide: AngularFirestore, useValue: mockFirestore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty missions list initially', () => {
    expect(component.missions.length).toBe(0);
  });
});
