import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerInfoComponent } from './volunteer-info.component';

describe('VolunteerInfoComponent', () => {
  let component: VolunteerInfoComponent;
  let fixture: ComponentFixture<VolunteerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolunteerInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
