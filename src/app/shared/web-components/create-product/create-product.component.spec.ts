import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCreateFormComponent } from './create-product.component';

describe('WebCreateFormComponent', () => {
  let component: WebCreateFormComponent;
  let fixture: ComponentFixture<WebCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
