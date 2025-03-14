import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from 'src/services/auth.service';
import { MissionService } from 'src/services/mission.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: any;
  let mockMissionService: any;

  beforeEach(async () => {
    // Mock des services
    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(
        Promise.resolve({ uid: 'testUserId', displayName: 'Test User', email: 'test@example.com' })
      ),
    };

    mockMissionService = {
      getUserMissions: jasmine.createSpy('getUserMissions').and.returnValue(of([{ id: '1', title: 'Mission 1' }])),
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MissionService, useValue: mockMissionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on init', async () => {
    await component.ngOnInit();
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
  });

  it('should load user missions', () => {
    expect(mockMissionService.getUserMissions).toHaveBeenCalled();
  });

  it('should display missions if available', () => {
    component.missions$.subscribe(missions => {
      expect(missions.length).toBeGreaterThan(0);
    });
  });
});
