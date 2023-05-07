import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InNeedComponent } from './in-need.component';

describe('InNeedComponent', () => {
  let component: InNeedComponent;
  let fixture: ComponentFixture<InNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InNeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
