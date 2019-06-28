import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLivesessionComponent } from './update-livesession.component';

describe('UpdateLivesessionComponent', () => {
  let component: UpdateLivesessionComponent;
  let fixture: ComponentFixture<UpdateLivesessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLivesessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLivesessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
