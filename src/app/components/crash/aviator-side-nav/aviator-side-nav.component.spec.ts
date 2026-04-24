import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AviatorSideNavComponent } from './aviator-side-nav.component';

describe('AviatorSideNavComponent', () => {
  let component: AviatorSideNavComponent;
  let fixture: ComponentFixture<AviatorSideNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AviatorSideNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AviatorSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
