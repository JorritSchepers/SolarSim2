import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollisionWarningComponent } from './collision-warning.component';

describe('CollisionWarningComponent', () => {
  let component: CollisionWarningComponent;
  let fixture: ComponentFixture<CollisionWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollisionWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollisionWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
