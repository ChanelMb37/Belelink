import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMissionComponent } from './create-mission.component';
import { MissionService } from 'src/services/mission.service';
import { AuthService } from 'src/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('CreateMissionComponent', () => {
  let component: CreateMissionComponent;
  let fixture: ComponentFixture<CreateMissionComponent>;
  let mockMissionService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    // Mock des services
    mockMissionService = {
      createMission: jasmine.createSpy('createMission').and.returnValue(Promise.resolve()),
    };

    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(
        Promise.resolve({ uid: 'testUserId', displayName: 'Test User' })
      ),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [CreateMissionComponent],
      providers: [
        { provide: MissionService, useValue: mockMissionService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly', () => {
    expect(component.missionForm).toBeDefined();
  });

  it('should not submit if form is invalid', async () => {
    spyOn(component, 'onSubmit');
    component.missionForm.setValue({ title: '', description: '', date: '' }); // Formulaire invalide
    await component.onSubmit();
    expect(mockMissionService.createMission).not.toHaveBeenCalled();
  });

  it('should submit form if valid', async () => {
    component.missionForm.setValue({ title: 'Test Mission', description: 'Test Description', date: '2025-06-01' });
    await component.onSubmit();
    expect(mockMissionService.createMission).toHaveBeenCalled();
  });
});
