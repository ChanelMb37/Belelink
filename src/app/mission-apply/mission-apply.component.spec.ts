import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionApplyComponent } from './mission-apply.component';

describe('MissionApplyComponent', () => {
  let component: MissionApplyComponent;
  let fixture: ComponentFixture<MissionApplyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionApplyComponent]
    });
    fixture = TestBed.createComponent(MissionApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
