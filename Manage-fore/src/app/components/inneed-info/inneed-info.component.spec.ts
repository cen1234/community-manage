import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InneedInfoComponent } from './inneed-info.component';

describe('InneedInfoComponent', () => {
  let component: InneedInfoComponent;
  let fixture: ComponentFixture<InneedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InneedInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InneedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
