import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSessionUrlComponent } from './live-session-url.component';

describe('LiveSessionComponent', () => {
  let component: LiveSessionUrlComponent;
  let fixture: ComponentFixture<LiveSessionUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveSessionUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSessionUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
