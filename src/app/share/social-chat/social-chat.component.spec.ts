import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialChatComponent } from './social-chat.component';

describe('SocialChatComponent', () => {
  let component: SocialChatComponent;
  let fixture: ComponentFixture<SocialChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
