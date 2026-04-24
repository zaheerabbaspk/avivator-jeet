import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AviatorHistoryComponent } from './aviator-history.component';

describe('AviatorHistoryComponent', () => {
  let component: AviatorHistoryComponent;
  let fixture: ComponentFixture<AviatorHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AviatorHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AviatorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
