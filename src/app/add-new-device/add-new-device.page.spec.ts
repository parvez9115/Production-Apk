import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewDevicePage } from './add-new-device.page';

describe('AddNewDevicePage', () => {
  let component: AddNewDevicePage;
  let fixture: ComponentFixture<AddNewDevicePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddNewDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
