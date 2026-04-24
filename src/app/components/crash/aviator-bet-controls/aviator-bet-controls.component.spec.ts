import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AviatorBetControlsComponent } from './aviator-bet-controls.component';

describe('AviatorBetControlsComponent', () => {
  let component: AviatorBetControlsComponent;
  let fixture: ComponentFixture<AviatorBetControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AviatorBetControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AviatorBetControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
