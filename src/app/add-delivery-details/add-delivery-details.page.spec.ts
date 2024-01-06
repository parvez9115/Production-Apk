import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AddDeliveryDetailsPage } from './add-delivery-details.page';

describe('AddDeliveryDetailsPage', () => {
  let component: AddDeliveryDetailsPage;
  let fixture: ComponentFixture<AddDeliveryDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddDeliveryDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
