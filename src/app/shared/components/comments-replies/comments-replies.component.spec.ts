import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsRepliesComponent } from './comments-replies.component';

describe('CommentsRepliesComponent', () => {
  let component: CommentsRepliesComponent;
  let fixture: ComponentFixture<CommentsRepliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsRepliesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsRepliesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
