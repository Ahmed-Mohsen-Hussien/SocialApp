import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLoadingComponent } from './post-loading.component';

describe('PostLoadingComponent', () => {
  let component: PostLoadingComponent;
  let fixture: ComponentFixture<PostLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostLoadingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
