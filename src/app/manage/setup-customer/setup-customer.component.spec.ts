import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupCustomerComponent } from './setup-customer.component';

describe('SetupCustomerComponent', () => {
  let component: SetupCustomerComponent;
  let fixture: ComponentFixture<SetupCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
