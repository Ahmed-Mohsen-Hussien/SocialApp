import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSuggestionComponent } from './single-suggestion.component';

describe('SingleSuggestionComponent', () => {
  let component: SingleSuggestionComponent;
  let fixture: ComponentFixture<SingleSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleSuggestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleSuggestionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
