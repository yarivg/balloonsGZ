import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMapPageComponent } from './support-map-page.component';

describe('SupportMapPageComponent', () => {
  let component: SupportMapPageComponent;
  let fixture: ComponentFixture<SupportMapPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportMapPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportMapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
