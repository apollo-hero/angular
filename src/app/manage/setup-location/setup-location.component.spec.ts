import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupLocationComponent } from './setup-location.component';

describe('SetupLocationComponent', () => {
  let component: SetupLocationComponent;
  let fixture: ComponentFixture<SetupLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
