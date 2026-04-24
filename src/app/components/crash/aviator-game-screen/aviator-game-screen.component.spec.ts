import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AviatorGameScreenComponent } from './aviator-game-screen.component';

describe('AviatorGameScreenComponent', () => {
  let component: AviatorGameScreenComponent;
  let fixture: ComponentFixture<AviatorGameScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AviatorGameScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AviatorGameScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
