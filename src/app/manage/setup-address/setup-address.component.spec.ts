import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupAddressComponent } from './setup-address.component';

describe('SetupAddressComponent', () => {
  let component: SetupAddressComponent;
  let fixture: ComponentFixture<SetupAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
