import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVersionAlertComponent } from './new-version-alert.component';

describe('NewVersionAlertComponent', () => {
  let component: NewVersionAlertComponent;
  let fixture: ComponentFixture<NewVersionAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVersionAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVersionAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
