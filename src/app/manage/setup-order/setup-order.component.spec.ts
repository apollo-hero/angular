import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupOrderComponent } from './setup-order.component';

describe('SetupOrderComponent', () => {
  let component: SetupOrderComponent;
  let fixture: ComponentFixture<SetupOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
