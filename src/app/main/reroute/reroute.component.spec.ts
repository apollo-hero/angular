import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RerouteComponent } from './reroute.component';

describe('RerouteComponent', () => {
  let component: RerouteComponent;
  let fixture: ComponentFixture<RerouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RerouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RerouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
