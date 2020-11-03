import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupCourierComponent } from './setup-courier.component';

describe('SetupCourierComponent', () => {
  let component: SetupCourierComponent;
  let fixture: ComponentFixture<SetupCourierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupCourierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
