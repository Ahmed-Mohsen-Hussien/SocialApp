import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCommentReplyComponent } from './single-comment-reply.component';

describe('SingleCommentReplyComponent', () => {
  let component: SingleCommentReplyComponent;
  let fixture: ComponentFixture<SingleCommentReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleCommentReplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleCommentReplyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
