import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionMapsComponent } from './direction-maps.component';

describe('DirectionMapsComponent', () => {
  let component: DirectionMapsComponent;
  let fixture: ComponentFixture<DirectionMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectionMapsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
