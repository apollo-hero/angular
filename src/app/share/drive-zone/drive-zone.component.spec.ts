import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveZoneComponent } from './drive-zone.component';

describe('DriveZoneComponent', () => {
  let component: DriveZoneComponent;
  let fixture: ComponentFixture<DriveZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriveZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
