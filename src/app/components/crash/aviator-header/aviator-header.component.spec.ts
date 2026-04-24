import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AviatorHeaderComponent } from './aviator-header.component';

describe('AviatorHeaderComponent', () => {
  let component: AviatorHeaderComponent;
  let fixture: ComponentFixture<AviatorHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AviatorHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AviatorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
