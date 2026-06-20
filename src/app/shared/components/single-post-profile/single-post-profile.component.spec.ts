import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePostProfileComponent } from './single-post-profile.component';

describe('SinglePostProfileComponent', () => {
  let component: SinglePostProfileComponent;
  let fixture: ComponentFixture<SinglePostProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglePostProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePostProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
