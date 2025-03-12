import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMissionComponent } from './create-mission.component';

describe('CreateMissionComponent', () => {
  let component: CreateMissionComponent;
  let fixture: ComponentFixture<CreateMissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMissionComponent]
    });
    fixture = TestBed.createComponent(CreateMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
