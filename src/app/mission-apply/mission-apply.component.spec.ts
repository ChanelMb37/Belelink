import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MissionApplyComponent } from './mission-apply.component';

describe('MissionApplyComponent', () => {
  let component: MissionApplyComponent;
  let fixture: ComponentFixture<MissionApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissionApplyComponent],
      imports: [FormsModule] // Ajouter FormsModule
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
