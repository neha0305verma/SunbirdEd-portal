import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ghost2Component } from './ghost2.component';

describe('Ghost2Component', () => {
  let component: Ghost2Component;
  let fixture: ComponentFixture<Ghost2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ghost2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ghost2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
