import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcmComponent } from './fcm.component';

describe('FcmComponent', () => {
  let component: FcmComponent;
  let fixture: ComponentFixture<FcmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
