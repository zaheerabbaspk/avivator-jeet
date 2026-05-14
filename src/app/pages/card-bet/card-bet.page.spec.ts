import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardBetPage } from './card-bet.page';

describe('CardBetPage', () => {
  let component: CardBetPage;
  let fixture: ComponentFixture<CardBetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
